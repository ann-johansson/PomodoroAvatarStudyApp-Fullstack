using PomodoroWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PomodoroWebAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSet properties for each of our models, representing the tables in our database
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<StudySession> StudySessions { get; set; }
        public DbSet<RewardPurchase> Purchases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            // Stops cascading deletes for Subjects when a User is deleted
            modelBuilder.Entity<StudySession>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Stops cascading deletes for Tasks when a User is deleted
            modelBuilder.Entity<TaskItem>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
