using ClassLibrary1.Interfaces;
using Infrastructure.Context;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassLibrary1.Implementations;

public class TournamentService : ITournamentService
{
    private readonly ApplicationContext _context;

    public TournamentService(ApplicationContext context)
    {
        _context = context;
    }
    
    public async Task<List<TournamentEntity>> GetAllAsync()
    {
        var tournaments = await _context.Tournaments.ToListAsync();

        return tournaments
            .Where(tournament => tournament.DateTimeStart <= DateTime.Now && tournament.DateTimeEnd > DateTime.Now)
            .ToList();
    }

    public async Task<TournamentEntity> GetByIdAsync(Guid id)
    {
        var tournament = await _context.Tournaments.FirstOrDefaultAsync(t => t.Id == id);

        return tournament!;
    }

    public async Task<Guid> AddAsync(TournamentEntity tournament)
    {
        var newTournament = await _context.Tournaments.AddAsync(tournament);
        
        await _context.SaveChangesAsync();

        return newTournament.Entity.Id;
    }
}