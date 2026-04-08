using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PomodoroWebAPI.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SubjectName { get; set; }
        public string ColorHex { get; set; }
        public bool IsDefault { get; set; } = false;

        // Foreign Key to AppUser
        public int? UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relations to other entities
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<StudySession> StudySessions { get; set; } = new List<StudySession>();
    }
}
