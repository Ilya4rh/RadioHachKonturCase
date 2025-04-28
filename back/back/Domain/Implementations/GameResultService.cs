using ClassLibrary1.Interfaces;
using Infrastructure.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassLibrary1.Implementations;

public class GameResultService : IGameResultService
{
    private readonly ApplicationContext _context;

    public GameResultService(ApplicationContext context)
    {
        _context = context;
    }

    public async Task<List<GameResultEntity>> GetResultsByTournamentId(Guid tournamentId)
    {
        var results = _context.GameResults
            .Where(result => result.Value.TournamentId == tournamentId)
            .Select(x => x.Value)
            .OrderByDescending(result => result.NumberOfPoints)
            .ToList();

        return results;
    }

    public async Task<Guid> AddGameResult(GameResultEntity gameResultEntity)
    {
        var newGameResult = _context.GameResults[gameResultEntity.Id] = gameResultEntity;

        return newGameResult.Id;
    }

    public async Task ChangeGameResult(GameResultEntity gameResultEntity)
    { 
        _context.GameResults[gameResultEntity.Id] = gameResultEntity;
    }
}