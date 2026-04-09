using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Models;
using System.Security.Claims;

namespace PomodoroWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController(AppDbContext context) : ControllerBase
    {
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<TaskItem>>> GetMyTasks()
        //{
        //    // 1. Hämta ID från inloggad användare
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //    if (userId == null) return Unauthorized();

        //    // 2. Hämta bara de tasks som tillhör denna användare
        //    var tasks = await context.Tasks
        //        .Where(t => t.UserId == userId)
        //        .ToListAsync();

        //    return Ok(tasks);
        //}

        //[HttpPost]
        //public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
        //{
        //    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //    if (userId == null) return Unauthorized();

        //    // Sätt UserId automatiskt innan vi sparar
        //    task.UserId = userId;

        //    context.TaskItems.Add(task);
        //    await context.SaveChangesAsync();

        //    return Ok(task);
        //}
    }
}
