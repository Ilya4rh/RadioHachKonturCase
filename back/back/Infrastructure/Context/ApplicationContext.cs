using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Context;

public class ApplicationContext : DbContext
{
    public DbSet<TournamentEntity> Tournaments { get; set; } = null!;
    
    public DbSet<GameResultEntity> GameResults { get; set; } = null!;
    
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite("Data Source=radioHack.db");
}