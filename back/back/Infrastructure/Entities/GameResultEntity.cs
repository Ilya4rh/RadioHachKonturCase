namespace Infrastructure.Entities;

public record GameResultEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid TournamentId { get; set; }
    
    public string? PlayerName { get; set; }
    
    public int NumberOfPoints { get; set; }
}