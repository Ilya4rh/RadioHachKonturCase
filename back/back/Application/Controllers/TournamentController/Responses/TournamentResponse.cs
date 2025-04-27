namespace WebApi.Controllers.TournamentController.Responses;

public record TournamentResponse
{
    public Guid Id { get; init; }
    
    public string Name { get; init; }
    
    public DateTime DateTimeStart { get; init; }
    
    public DateTime DateTimeEnd { get; init; }
}