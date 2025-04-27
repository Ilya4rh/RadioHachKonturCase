namespace WebApi.Controllers.GameResultController.Responses;

public record GameResultResponse
{
    public Guid Id { get; init; }
    
    public Guid TournamentId { get; init; }
    
    public string? PlayerName { get; init; }
    
    public int NumberOfPoints { get; init; }
}