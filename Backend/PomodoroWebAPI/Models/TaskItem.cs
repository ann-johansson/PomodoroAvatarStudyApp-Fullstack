using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PomodoroWebAPI.Models
{
    // Enum to represent the status of a task, with values for todo, in progress, done, and skipped tasks
    public enum TaskStatus { Todo, InProgress, Done, Skipped }

    public class TaskItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string TaskName { get; set; } = string.Empty;

        [Required]
        public string UserId { get; set; } = string.Empty;

        public string? Description { get; set; }
        public int EstimatedMinutes { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int PointsReward { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Todo; // using enum to represent the status of the task

        // Navigation properties to represent the relationships with AppUser and Subject entities
        [ForeignKey("UserId")]
        public AppUser? User { get; set; }

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject? Subject { get; set; }
    }
}