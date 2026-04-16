using Microsoft.EntityFrameworkCore;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Models;

namespace PomodoroWebAPI.Services
{
    public class SubjectService(AppDbContext context)
    {
        // GET
        public async Task<IEnumerable<Subject>> GetUserSubjectsAsync(string userId)
        {
            return await context.Subjects
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        // POST
        public async Task<Subject> CreateSubjectAsync(Subject subject, string userId)
        {
            subject.UserId = userId;
            subject.CreatedAt = DateTime.UtcNow; // Set creation time

            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
            return subject;
        }

        // PUT
        public async Task<Subject?> UpdateSubjectAsync(int subjectId, Subject updatedSubject, string userId)
        {
            // Retrieve the existing subject to ensure it belongs to the user and to update only specific fields
            var existingSubject = await context.Subjects.FirstOrDefaultAsync(s => s.Id == subjectId && s.UserId == userId);

            if (existingSubject == null) return null;

            // Update the values
            existingSubject.SubjectName = updatedSubject.SubjectName;
            existingSubject.ColorHex = updatedSubject.ColorHex;
            existingSubject.IsDefault = updatedSubject.IsDefault;

            await context.SaveChangesAsync();
            return existingSubject;
        }

        // DELETE
        public async Task<bool> DeleteSubjectAsync(int subjectId, string userId)
        {
            // Retrieve the subject to ensure it belongs to the user before deleting
            var subject = await context.Subjects.FirstOrDefaultAsync(s => s.Id == subjectId && s.UserId == userId);

            if (subject == null) return false;

            context.Subjects.Remove(subject);
            await context.SaveChangesAsync();
            return true;
        }
    }
}