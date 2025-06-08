using ClassLibrary1.Implementations;
using ClassLibrary1.Interfaces;
using ClassLibrary1.Models;
using Infrastructure.Context;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://51.250.34.126")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddTransient<ApplicationContext>();
builder.Services.AddTransient<ITournamentService, TournamentService>();
builder.Services.AddTransient<IGameResultService, GameResultService>();

builder.Configuration.AddJsonFile("secrets.json");
builder.Services.Configure<Admin>(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();