using Infrastructure.Entities;

namespace ClassLibrary1.Interfaces;

public interface ITournamentService
{
    Task<List<TournamentEntity>> GetAllAsync();

    Task<TournamentEntity> GetByIdAsync(Guid id);

    Task<Guid> AddAsync(TournamentEntity tournament);
}