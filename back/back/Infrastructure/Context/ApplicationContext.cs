using System.Collections.Concurrent;
using Infrastructure.Entities;

namespace Infrastructure.Context;

public class ApplicationContext
{
    public ApplicationContext()
    {
        Tournaments = new ConcurrentDictionary<Guid, TournamentEntity>();
        GameResults = new ConcurrentDictionary<Guid, GameResultEntity>();
    }
    public ConcurrentDictionary<Guid, TournamentEntity> Tournaments { get; set; } = null!;
    
    public ConcurrentDictionary<Guid, GameResultEntity> GameResults { get; set; } = null!;
}