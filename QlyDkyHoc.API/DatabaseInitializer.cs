using Microsoft.Data.SqlClient;
using System.Text;
using System.Text.RegularExpressions;

namespace QlyDkyHoc.API;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(
        IConfiguration configuration,
        IWebHostEnvironment environment,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            logger.LogWarning("Skip database init because DefaultConnection is empty.");
            return;
        }

        var scriptPath = ResolveScriptPath(environment);
        if (scriptPath == null)
        {
            logger.LogWarning("Skip database init because CREATE_DATABASE.sql was not found.");
            return;
        }

        var builder = new SqlConnectionStringBuilder(connectionString);
        var databaseName = builder.InitialCatalog;
        if (string.IsNullOrWhiteSpace(databaseName))
        {
            logger.LogWarning("Skip database init because the connection string has no Database/Initial Catalog.");
            return;
        }

        var masterBuilder = new SqlConnectionStringBuilder(builder.ConnectionString)
        {
            InitialCatalog = "master"
        };

        await ExecuteWithRetryAsync(async () =>
        {
            await using var connection = new SqlConnection(masterBuilder.ConnectionString);
            await connection.OpenAsync(cancellationToken);

            await ExecuteCommandAsync(connection, $"""
                IF DB_ID(N'{EscapeSqlLiteral(databaseName)}') IS NULL
                BEGIN
                    CREATE DATABASE [{EscapeSqlIdentifier(databaseName)}];
                END
                """, cancellationToken);

            var script = await File.ReadAllTextAsync(scriptPath, Encoding.UTF8, cancellationToken);
            foreach (var batch in SplitBatches(script))
            {
                await ExecuteCommandAsync(connection, batch, cancellationToken);
            }
        }, logger, cancellationToken);
    }

    private static string? ResolveScriptPath(IWebHostEnvironment environment)
    {
        var candidates = new[]
        {
            Path.Combine(environment.ContentRootPath, "CREATE_DATABASE.sql"),
            Path.Combine(AppContext.BaseDirectory, "CREATE_DATABASE.sql")
        };

        return candidates.FirstOrDefault(File.Exists);
    }

    private static async Task ExecuteWithRetryAsync(
        Func<Task> action,
        ILogger logger,
        CancellationToken cancellationToken)
    {
        const int maxAttempts = 20;

        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                await action();
                return;
            }
            catch (SqlException ex) when (attempt < maxAttempts)
            {
                logger.LogWarning(ex, "SQL Server is not ready yet ({Attempt}/{MaxAttempts}).", attempt, maxAttempts);
                await Task.Delay(TimeSpan.FromSeconds(3), cancellationToken);
            }
        }
    }

    private static async Task ExecuteCommandAsync(
        SqlConnection connection,
        string sql,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(sql))
        {
            return;
        }

        await using var command = connection.CreateCommand();
        command.CommandText = sql;
        command.CommandTimeout = 120;
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    private static IEnumerable<string> SplitBatches(string script)
    {
        var current = new StringBuilder();
        using var reader = new StringReader(script);

        while (reader.ReadLine() is { } line)
        {
            if (Regex.IsMatch(line, @"^\s*GO\s*(?:--.*)?$", RegexOptions.IgnoreCase))
            {
                if (current.Length > 0)
                {
                    yield return current.ToString();
                    current.Clear();
                }

                continue;
            }

            current.AppendLine(line);
        }

        if (current.Length > 0)
        {
            yield return current.ToString();
        }
    }

    private static string EscapeSqlLiteral(string value) => value.Replace("'", "''");

    private static string EscapeSqlIdentifier(string value) => value.Replace("]", "]]");
}
