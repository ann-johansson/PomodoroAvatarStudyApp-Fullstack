using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PomodoroWebAPI.Models
{
    public enum SessionStatus
    {
        Planned,
        Active,
        Completed,
        Cancelled
    }
    public class StudySession
    {
        [Key]
        public int Id { get; set; }

        // Relations
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }

        public int SubjectId { get; set; }
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; }
        public DateTime PlannedStartTime { get; set; }
        public DateTime? ActualStartTime { get; set; }
        public DateTime? EndTime { get; set; }

        // Duration och Breaks
        public int PlannedDurationMinutes { get; set; } // Use in the frontend to calculate planned end time
        public int ActualDurationMinutes { get; set; }

        public int BreakIntervalMinutes { get; set; }
        public int BreakLengthMinutes { get; set; }

        // Status and Points
        public SessionStatus Status { get; set; } = SessionStatus.Planned;
        public int PointsEarned { get; set; }
    }
}
