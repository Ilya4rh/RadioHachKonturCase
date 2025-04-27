FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /back/back
COPY ./publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "Application.dll"]