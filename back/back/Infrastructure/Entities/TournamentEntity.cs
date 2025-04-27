namespace Infrastructure.Entities;

public record TournamentEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    
    public string? Name { get; init; }
    
    public DateTime DateTimeStart { get; init; }
    
    public DateTime DateTimeEnd { get; init; }
}