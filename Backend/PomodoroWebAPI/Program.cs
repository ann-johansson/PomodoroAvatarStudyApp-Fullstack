
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PomodoroWebAPI.Controllers;
using PomodoroWebAPI.Data;
using PomodoroWebAPI.Models;
using PomodoroWebAPI.Services;
using System.Text;

namespace PomodoroWebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                });

            // 1. Hämta JWT-inställningar
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            // 2. Konfigurera Authentication
            builder.Services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"],
                    ValidateLifetime = true
                };
            });

            builder.Services.AddScoped<TokenService>();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<TaskService>();
            builder.Services.AddScoped<SubjectService>();
            builder.Services.AddScoped<StudySessionService>();

            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            // Configure CORS to allow requests from the React development server
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", builder =>
                {
                    builder.WithOrigins("http://localhost:5173") // React development server URL
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                // Exposes: /openapi/v1.json
                app.MapOpenApi();

                // Exposes Swagger UI: /swagger
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/openapi/v1.json", "My API v1");
                    options.RoutePrefix = "swagger";
                });
            }

            // Prevent redirecting HTTP to HTTPS during local dev to fix CORS preflight issues
            // app.UseHttpsRedirection();

            app.UseCors("AllowReactApp"); // Apply the CORS policy

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                dbContext.Database.Migrate(); // Skapar databasen automatiskt om den saknas

                if (!dbContext.Users.Any())
                {
                    var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<AppUser>();

                    var adminUser = new AppUser { Id = Guid.NewGuid().ToString(), UserName = "admin", Email = "admin@test.com", Role = "Admin", DisplayName = "Administrator" };
                    adminUser.PasswordHash = hasher.HashPassword(adminUser, "Admin123!");

                    var normalUser = new AppUser { Id = Guid.NewGuid().ToString(), UserName = "user", Email = "user@test.com", Role = "User", DisplayName = "Student" };
                    normalUser.PasswordHash = hasher.HashPassword(normalUser, "User123!");

                    dbContext.Users.AddRange(adminUser, normalUser);
                    dbContext.SaveChanges();
                }
            }

            app.Run();
        }
    }
}
