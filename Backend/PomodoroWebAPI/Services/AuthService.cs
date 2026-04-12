using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Dtos;
using PomodoroWebAPI.Models;

namespace PomodoroWebAPI.Services
{
    public class AuthService(AppDbContext context)
    {
        
        public async Task<bool> RegisterAsync(RegisterDto registerDto)
        {
            // Checks if the username already exists in the database
            if (await context.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                return false;
            }

            var passwordHasher = new PasswordHasher<AppUser>();
            var user = new AppUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = registerDto.Username,
                Email = registerDto.Email,
                Role = "User",
                DisplayName = registerDto.DisplayName
            };

            user.PasswordHash = passwordHasher.HashPassword(user, registerDto.Password);

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return true;
        }

        // Returns the user if login is successful, otherwise returns null
        public async Task<AppUser?> LoginAsync(LoginDto loginDto)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username);

            // If the user is not found, return null
            if (user == null) return null;

            var passwordHasher = new PasswordHasher<AppUser>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash!, loginDto.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return null; // If the password is incorrect, return null
            }

            return user; // Return the user to the controller
        }
    }
}