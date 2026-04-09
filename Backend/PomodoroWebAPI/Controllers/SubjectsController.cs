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
    public class SubjectsController(SubjectService subjectService) : ControllerBase
    {
        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetMySubjects()
        {
            var subjects = await subjectService.GetUserSubjectsAsync(GetUserId());
            return Ok(subjects);
        }

        [HttpPost]
        public async Task<ActionResult<Subject>> CreateSubject(Subject subject)
        {
            var createdSubject = await subjectService.CreateSubjectAsync(subject, GetUserId());
            return Ok(createdSubject);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Subject>> UpdateSubject(int id, Subject subject)
        {
            var updatedSubject = await subjectService.UpdateSubjectAsync(id, subject, GetUserId());

            if (updatedSubject == null) return NotFound("Subject not found or does not belong to you.");

            return Ok(updatedSubject);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSubject(int id)
        {
            var success = await subjectService.DeleteSubjectAsync(id, GetUserId());

            if (!success) return NotFound("Subject not found or does not belong to you.");

            return Ok("The subject has been deleted.");
        }
    }
}
