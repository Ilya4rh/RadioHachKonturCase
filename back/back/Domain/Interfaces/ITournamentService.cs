using Infrastructure.Entities;

namespace ClassLibrary1.Interfaces;

public interface ITournamentService
{
    Task<List<TournamentEntity>> GetAllAsync();

    Task<List<TournamentEntity>> GetActualTournaments();

    Task<TournamentEntity> GetByIdAsync(Guid id);

    Task<Guid> AddAsync(TournamentEntity tournament);
    
    Task<Guid> DeleteAsync(Guid id);
}