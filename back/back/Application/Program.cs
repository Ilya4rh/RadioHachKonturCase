using ClassLibrary1.Implementations;
using ClassLibrary1.Interfaces;
using Infrastructure.Context;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddTransient<ApplicationContext>();
builder.Services.AddTransient<ITournamentService, TournamentService>();
builder.Services.AddTransient<IGameResultService, GameResultService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();