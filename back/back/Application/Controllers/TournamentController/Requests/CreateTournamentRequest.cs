using System.Text.Json.Serialization;

namespace WebApi.Controllers.TournamentController.Requests;

public record CreateTournamentRequest
{
    [JsonPropertyName("name")]
    public required string Name { get; init; }
    
    [JsonPropertyName("dateTimeStart")]
    public DateTime DateTimeStart { get; init; }
    
    [JsonPropertyName("dateTimeEnd")]
    public DateTime DateTimeEnd { get; init; }
}