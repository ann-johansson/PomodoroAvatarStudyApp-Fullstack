using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Models;
using PomodoroWebAPI.Services;
using System.Security.Claims;

namespace PomodoroWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController(TaskService taskService) : ControllerBase
    {
        
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetMyTasks()
        {
            var tasks = await taskService.GetUserTasksAsync(GetUserId());
            return Ok(tasks);
        }

        // GET COMPLETED TASKS
        [HttpGet("completed")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetCompletedTasks()
        {
            var tasks = await taskService.GetCompletedTasksAsync(GetUserId());
            return Ok(tasks);
        }

        // ADMIN ENDPOINT
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<TaskItem>>> GetAllTasksAdmin()
        {
            var tasks = await taskService.GetAllTasksAdminAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        {
            var createdTask = await taskService.CreateTaskAsync(task, GetUserId());
            return Ok(createdTask);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TaskItem>> UpdateTask(int id, TaskItem task)
        {
            var updatedTask = await taskService.UpdateTaskAsync(id, task, GetUserId());

            if (updatedTask == null) return NotFound("Task not found or does not belong to you.");

            return Ok(updatedTask);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var success = await taskService.DeleteTaskAsync(id, GetUserId());

            if (!success) return NotFound("Task not found or does not belong to you.");

            return Ok("The task has been deleted.");
        }
    }
}
