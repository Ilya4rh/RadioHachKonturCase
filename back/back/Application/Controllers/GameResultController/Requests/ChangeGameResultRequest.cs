namespace WebApi.Controllers.GameResultController.Requests;

public record ChangeGameResultRequest
{
    public Guid Id { get; set; }
    
    public Guid TournamentId { get; set; }
    
    public string? PlayerName { get; set; }
    
    public int NumberOfPoints { get; set; }
}