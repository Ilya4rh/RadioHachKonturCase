FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /back/back/publish
ENV ASPNETCORE_URLS=http://+:5085
EXPOSE 5085
ENTRYPOINT ["dotnet", "Application.dll"]