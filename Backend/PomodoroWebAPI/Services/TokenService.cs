using Microsoft.IdentityModel.Tokens;
using PomodoroWebAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PomodoroWebAPI.Services
{
    public class TokenService(IConfiguration config)
    {
        // This method creates a JWT token for the authenticated user
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim> //List of claims to include in the token
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Role, user.Role)
        };

            // We create a symmetric security key using the secret key from the configuration and specify the signing algorithm
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            // We create a SecurityTokenDescriptor which describes the contents of the token
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds,
                Issuer = config["Jwt:Issuer"],
                Audience = config["Jwt:Audience"]
            };

            // We use the JwtSecurityTokenHandler to create the token based on the token descriptor and return it as a string
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
