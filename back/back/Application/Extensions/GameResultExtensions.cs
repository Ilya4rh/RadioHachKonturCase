using Infrastructure.Entities;
using WebApi.Controllers.GameResultController.Requests;
using WebApi.Controllers.GameResultController.Responses;

namespace WebApi.Extensions;

public static class GameResultExtensions
{
    public static GameResultEntity ToEntity(this CreateGameResultRequest request)
    {
        return new GameResultEntity
        {
            TournamentId = request.TournamentId,
            PlayerName = request.PlayerName,
            NumberOfPoints = request.NumberOfPoints
        };
    }
    
    public static GameResultEntity ToEntity(this ChangeGameResultRequest request)
    {
        return new GameResultEntity
        {
            Id = request.Id,
            TournamentId = request.TournamentId,
            PlayerName = request.PlayerName,
            NumberOfPoints = request.NumberOfPoints
        };
    }

    public static GameResultResponse ToResponse(this GameResultEntity gameResult)
    {
        return new GameResultResponse
        {
            Id = gameResult.Id,
            TournamentId = gameResult.TournamentId,
            PlayerName = gameResult.PlayerName,
            NumberOfPoints = gameResult.NumberOfPoints
        };
    }
}