using Microsoft.EntityFrameworkCore;

namespace AuctionApp.Models;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options)
        : base(options) { }

    public DbSet<Auction> Auctions => Set<Auction>();

    public DbSet<Bidding> Biddings => Set<Bidding>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Auction>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

        modelBuilder.Entity<Bidding>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

        // Define the relationship between Auction and Bidding
        modelBuilder.Entity<Auction>()
            .HasMany(a => a.Biddings)
            // .WithOne(b => b.Auction)
            .WithOne()
            .HasForeignKey(b => b.AuctionId);
            // .IsRequired();
    }
}