using Microsoft.AspNetCore.Mvc;
using PomodoroWebAPI.Dtos;
using PomodoroWebAPI.Services;

namespace PomodoroWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(TokenService tokenService, AuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                // We await the RegisterAsync method which now returns a boolean indicating success or failure
                var success = await authService.RegisterAsync(registerDto);

                if (!success)
                {
                    return BadRequest("Username is already taken.");
                }

                return Ok("User is created!");
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here) and return a generic error message
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto loginDto)
        {
            // Returns an AppUser if successful, otherwise null
            var user = await authService.LoginAsync(loginDto);

            if (user == null)
            {
                // Return the same error regardless of whether the username or password is incorrect
                return Unauthorized("Wrong username or password.");
            }

            // If we reach this point, the login was successful and we can generate a token for the user
            var token = tokenService.CreateToken(user);

            return Ok(token);
        }
    }
}