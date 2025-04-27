using Infrastructure.Entities;
using WebApi.Controllers.TournamentController;
using WebApi.Controllers.TournamentController.Requests;
using WebApi.Controllers.TournamentController.Responses;

namespace WebApi.Extensions;

public static class TournamentExtensions
{
    public static TournamentEntity ToEntity(this CreateTournamentRequest tournamentRequest)
    {
        return new TournamentEntity
        {
            Name = tournamentRequest.Name,
            DateTimeStart = tournamentRequest.DateTimeStart,
            DateTimeEnd = tournamentRequest.DateTimeEnd
        };
    }

    public static TournamentResponse ToResponse(this TournamentEntity tournamentEntity)
    {
        return new TournamentResponse
        {
            Id = tournamentEntity.Id,
            Name = tournamentEntity.Name,
            DateTimeStart = tournamentEntity.DateTimeStart,
            DateTimeEnd = tournamentEntity.DateTimeEnd
        };
    }
}