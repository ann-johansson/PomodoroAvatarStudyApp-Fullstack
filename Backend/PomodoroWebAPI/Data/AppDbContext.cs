using PomodoroWebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PomodoroWebAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Dessa blir tabellerna i din SQL-databas
        public DbSet<AppUser> Users { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<StudySession> StudySessions { get; set; }
        public DbSet<RewardPurchase> Purchases { get; set; }
    }
}
