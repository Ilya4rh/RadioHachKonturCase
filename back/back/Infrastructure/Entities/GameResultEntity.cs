namespace Infrastructure.Entities;

public record GameResultEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public Guid TournamentId { get; init; }
    
    public string? PlayerName { get; init; }
    
    public int NumberOfPoints { get; init; }
}