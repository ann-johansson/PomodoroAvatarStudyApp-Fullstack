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
            return await context.StudySessions
                .Include(s => s.Subject) // Load related subject data
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        // POST
        public async Task<StudySession> CreateSessionAsync(StudySession session, string userId)
        {
            session.UserId = userId;
            session.Status = SessionStatus.Planned;

            context.StudySessions.Add(session);
            await context.SaveChangesAsync();
            return session;
        }

        // PUT
        public async Task<StudySession?> UpdateSessionAsync(int sessionId, StudySession updatedSession, string userId)
        {
            var existingSession = await context.StudySessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (existingSession == null) return null;

            // Only allow updates to certain fields
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
            var session = await context.StudySessions.FirstOrDefaultAsync(s => s.Id == sessionId && s.UserId == userId);

            if (session == null) return false;

            context.StudySessions.Remove(session);
            await context.SaveChangesAsync();
            return true;
        }
    }
}