using Infrastructure.Entities;

namespace ClassLibrary1.Interfaces;

public interface IGameResultService
{
    Task<List<GameResultEntity>> GetResultsByTournamentId(Guid tournamentId);

    Task<Guid> AddGameResult(GameResultEntity gameResultEntity);

    Task ChangeGameResult(GameResultEntity gameResultEntity);
}