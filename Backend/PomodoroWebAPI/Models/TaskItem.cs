using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PomodoroWebAPI.Models
{
    public enum TaskStatus { Todo, InProgress, Done, Skipped }

    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string TaskName { get; set; } = string.Empty;

        [Required]
        public string UserId { get; set; } = string.Empty; // Denna används som FK

        public string? Description { get; set; }
        public int EstimatedMinutes { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int PointsReward { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Todo;

        [ForeignKey("UserId")]
        public AppUser? User { get; set; }

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }
    }
}