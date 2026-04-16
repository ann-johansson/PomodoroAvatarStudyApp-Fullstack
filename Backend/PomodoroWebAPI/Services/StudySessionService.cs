using Microsoft.EntityFrameworkCore;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Models;

namespace PomodoroWebAPI.Services
{
    public class StudySessionService(AppDbContext context)
    {
        // GET
        public async Task<IEnumerable<StudySession>> GetUserSessionsAsync(string userId)
        {
            // Include the related Subject data when retrieving study sessions
            return await context.StudySessions
                .Include(s => s.Subject) // Load related subject data
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        // POST
        public async Task<StudySession> CreateSessionAsync(StudySession session, string userId)
        {
            session.UserId = userId;
            // Only default to Planned if it hasn't been set to Completed yet
            if (session.Status == SessionStatus.Planned && session.ActualDurationMinutes == 0)
            {
                session.Status = SessionStatus.Planned;
            }

            context.StudySessions.Add(session);
            await context.SaveChangesAsync();
            return session;
        }

        // PUT
        public async Task<StudySession?> UpdateSessionAsync(int sessionId, StudySession updatedSession, string userId)
        {
            // Retrieve the existing session to ensure it belongs to the user and to update only specific fields
            var existingSession = await context.StudySessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (existingSession == null) return null;

            existingSession.ActualStartTime = updatedSession.ActualStartTime;
            existingSession.EndTime = updatedSession.EndTime;
            existingSession.ActualDurationMinutes = updatedSession.ActualDurationMinutes;
            existingSession.Status = updatedSession.Status;
            existingSession.PointsEarned = updatedSession.PointsEarned;

            await context.SaveChangesAsync();
            return existingSession;
        }

        // DELETE
        public async Task<bool> DeleteSessionAsync(int sessionId, string userId)
        {
            // Retrieve the session to ensure it belongs to the user before deleting
            var session = await context.StudySessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (session == null) return false;

            context.StudySessions.Remove(session);
            await context.SaveChangesAsync();
            return true;
        }
    }
}