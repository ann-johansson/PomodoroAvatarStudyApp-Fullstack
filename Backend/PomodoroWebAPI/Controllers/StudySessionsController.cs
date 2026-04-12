using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PomodoroWebAPI.Models;
using PomodoroWebAPI.Services;
using System.Security.Claims;

namespace PomodoroWebAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StudySessionsController(StudySessionService sessionService) : ControllerBase
    {
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudySession>>> GetMySessions()
        {
            var sessions = await sessionService.GetUserSessionsAsync(GetUserId());
            return Ok(sessions);
        }

        [HttpPost]
        public async Task<ActionResult<StudySession>> CreateSession(StudySession session)
        {
            var createdSession = await sessionService.CreateSessionAsync(session, GetUserId());
            return Ok(createdSession);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<StudySession>> UpdateSession(int id, StudySession session)
        {
            var updatedSession = await sessionService.UpdateSessionAsync(id, session, GetUserId());

            if (updatedSession == null) return NotFound("Sessionen hittades inte eller tillhör inte dig.");

            return Ok(updatedSession);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSession(int id)
        {
            var success = await sessionService.DeleteSessionAsync(id, GetUserId());

            if (!success) return NotFound("Sessionen hittades inte eller tillhör inte dig.");

            return Ok("Sessionen är raderad.");
        }
    }
}
