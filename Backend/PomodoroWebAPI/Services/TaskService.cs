using Microsoft.EntityFrameworkCore;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Models;

namespace PomodoroWebAPI.Services
{
    public class TaskService(AppDbContext context)
    {
        // GET
        public async Task<IEnumerable<TaskItem>> GetUserTasksAsync(string userId)
        {
            return await context.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        // POST
        public async Task<TaskItem> CreateTaskAsync(TaskItem task, string userId)
        {
            task.UserId = userId;
            context.Tasks.Add(task);
            await context.SaveChangesAsync();
            return task;
        }

        // PUT
        public async Task<TaskItem?> UpdateTaskAsync(int taskId, TaskItem updatedTask, string userId)
        {
            // Check if the task exists and belongs to the user
            var existingTask = await context.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (existingTask == null) return null;

            // Update the values
            existingTask.TaskName = updatedTask.TaskName;
            existingTask.Description = updatedTask.Description;
            existingTask.Status = updatedTask.Status;
            existingTask.EstimatedMinutes = updatedTask.EstimatedMinutes;

            if (updatedTask.Status == Models.TaskStatus.Done)
            {
                existingTask.CompletedAt = DateTime.UtcNow;
            }

            await context.SaveChangesAsync();
            return existingTask;
        }

        // DELETE
        public async Task<bool> DeleteTaskAsync(int taskId, string userId)
        {
            var task = await context.Tasks.FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null) return false;

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();
            return true;
        }
    }
}