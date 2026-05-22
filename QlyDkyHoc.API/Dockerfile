# Sử dụng môi trường SDK để Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["QlyDkyHoc.API.csproj", "./"]
RUN dotnet restore --disable-parallel
COPY . .
RUN dotnet publish -c Release -o /app

# Sử dụng môi trường Runtime để chạy
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "QlyDkyHoc.API.dll"]