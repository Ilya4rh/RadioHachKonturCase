namespace WebApi.Controllers.GameResultController.Requests;

public record ChangeGameResultRequest
{
    public Guid Id { get; init; }
    
    public Guid TournamentId { get; init; }
    
    public string? PlayerName { get; init; }
    
    public int NumberOfPoints { get; init; }
}