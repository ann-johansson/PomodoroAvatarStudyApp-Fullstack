using System.ComponentModel.DataAnnotations;

namespace PomodoroWebAPI.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = null!;
        [Required]
        public string DisplayName { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }
}
