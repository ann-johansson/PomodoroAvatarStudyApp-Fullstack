using System.ComponentModel.DataAnnotations;

namespace PomodoroWebAPI.Dtos
{
    // DTO for user login, containing the username and password fields with validation attributes
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
    }
}
