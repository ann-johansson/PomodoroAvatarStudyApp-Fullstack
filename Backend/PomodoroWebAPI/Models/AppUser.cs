using System.ComponentModel.DataAnnotations;

namespace PomodoroWebAPI.Models
{
    public class AppUser
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User"; // Default role is "User"
        public string DisplayName { get; set; }
        public int Level { get; set; } = 1;
        public int TotalPoints { get; set; } = 0;
        public int Coins { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relations to other entities
        public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<StudySession> StudySessions { get; set; } = new List<StudySession>();
        public ICollection<RewardPurchase> Purchases { get; set; } = new List<RewardPurchase>();
    }
}
