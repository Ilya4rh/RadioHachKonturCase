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
        var results = await _context.GameResults
            .Where(result => result.TournamentId == tournamentId)
            .OrderByDescending(result => result.NumberOfPoints)
            .ToListAsync();

        return results.ToList();
    }

    public async Task<Guid> AddGameResult(GameResultEntity gameResultEntity)
    {
        var newGameResult = await _context.GameResults.AddAsync(gameResultEntity);

        await _context.SaveChangesAsync();

        return newGameResult.Entity.Id;
    }

    public async Task ChangeGameResult(GameResultEntity gameResultEntity)
    {
        _context.GameResults.Update(gameResultEntity);
        
        await _context.SaveChangesAsync();
    }
}