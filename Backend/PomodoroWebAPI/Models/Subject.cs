using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PomodoroWebAPI.Models
{
    public class Subject
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SubjectName { get; set; } = string.Empty;

        [Required]
        public string UserId { get; set; } = string.Empty; // Denna används som FK

        public string ColorHex { get; set; } = "#BD93F9";
        public bool IsDefault { get; set; } = false;

        [ForeignKey("UserId")]
        public AppUser? User { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        public ICollection<StudySession> StudySessions { get; set; } = new List<StudySession>();
    }
}