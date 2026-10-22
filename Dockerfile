# syntax=docker/dockerfile:1
#
# Imagem única: a API .NET serve a API (/api) e o front-end React compilado (wwwroot).
#   docker build -t catalogo-sesi .
#   docker run -p 8080:8080 catalogo-sesi

# 1) Front-end: build do React (Vite)
FROM node:22-alpine AS front
WORKDIR /src/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# 2) Back-end: restauração (camada em cache) e publicação da API
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api
WORKDIR /src
COPY backend/src/Sesi.Catalogo.Api/Sesi.Catalogo.Api.csproj backend/src/Sesi.Catalogo.Api/
RUN dotnet restore backend/src/Sesi.Catalogo.Api/Sesi.Catalogo.Api.csproj
COPY backend/ backend/
RUN dotnet publish backend/src/Sesi.Catalogo.Api/Sesi.Catalogo.Api.csproj -c Release -o /out --no-restore

# 3) Imagem final: runtime ASP.NET + API publicada + front-end em wwwroot
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=api /out ./
COPY --from=front /src/frontend/dist ./wwwroot

# Banco SQLite em /data (monte um volume para persistir; sem volume, é recriado com o seed a cada início).
RUN mkdir -p /data && chown -R app:app /data
ENV ConnectionStrings__Catalogo="Data Source=/data/catalogo.db" \
    Swagger__Habilitado=true \
    ASPNETCORE_URLS=http://0.0.0.0:8080 \
    DOTNET_gcServer=0

USER app
EXPOSE 8080
ENTRYPOINT ["dotnet", "Sesi.Catalogo.Api.dll"]
