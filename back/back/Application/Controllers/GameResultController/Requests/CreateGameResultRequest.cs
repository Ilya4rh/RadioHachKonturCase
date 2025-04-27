using System.Text.Json.Serialization;

namespace WebApi.Controllers.GameResultController.Requests;

public record CreateGameResultRequest
{
    [JsonPropertyName("tournamentId")]
    public Guid TournamentId { get; init; }
    
    [JsonPropertyName("playerName")]
    public string? PlayerName { get; init; }
    
    [JsonPropertyName("numberOfPoints")]
    public int NumberOfPoints { get; init; }
}