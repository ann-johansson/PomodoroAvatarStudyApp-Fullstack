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

        // GET to retrieve all study sessions for the authenticated user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudySession>>> GetMySessions()
        {
            var sessions = await sessionService.GetUserSessionsAsync(GetUserId());
            return Ok(sessions);
        }

        // POST to create a new study session for the authenticated user
        [HttpPost]
        public async Task<ActionResult<StudySession>> CreateSession(StudySession session)
        {
            var createdSession = await sessionService.CreateSessionAsync(session, GetUserId());
            return Ok(createdSession);
        }

        // PUT to update an existing study session for the authenticated user
        [HttpPut("{id}")]
        public async Task<ActionResult<StudySession>> UpdateSession(int id, StudySession session)
        {
            var updatedSession = await sessionService.UpdateSessionAsync(id, session, GetUserId());

            if (updatedSession == null) return NotFound("Sessionen hittades inte eller tillhör inte dig.");

            return Ok(updatedSession);
        }

        // DELETE to remove a study session for the authenticated user
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSession(int id)
        {
            var success = await sessionService.DeleteSessionAsync(id, GetUserId());

            if (!success) return NotFound("Sessionen hittades inte eller tillhör inte dig.");

            return Ok("Sessionen är raderad.");
        }
    }
}
