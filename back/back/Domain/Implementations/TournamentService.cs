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
        var tournaments = _context.Tournaments.Select(x => x.Value)
            .Where(x => x.DateTimeStart <= DateTime.Now && x.DateTimeEnd > DateTime.Now);

        return tournaments
            .ToList();
    }

    public async Task<TournamentEntity> GetByIdAsync(Guid id)
    {
        return _context.Tournaments[id];
    }

    public async Task<Guid> AddAsync(TournamentEntity tournament)
    {
        _context.Tournaments[tournament.Id] = tournament;

        return tournament.Id;
    }
}