namespace PomodoroAvatarStudyApp_Fullstack
{
	public class Program
	{
		public static void Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);

			// Add services to the container.
			builder.Services.AddControllers();

			// OpenAPI / Swagger
			builder.Services.AddOpenApi();
			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen();

			// CORS configuration to allow requests from the React frontend
			builder.Services.AddCors(options =>
			{
				options.AddPolicy("AllowReact", policy =>
				{
					policy.WithOrigins("http://localhost:7288")
						  .AllowAnyHeader()
						  .AllowAnyMethod();
				});
			});

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseHttpsRedirection();

			// cors middleware should be placed before authorization and after routing
			app.UseCors("AllowReact");

			app.UseAuthorization();

			app.MapControllers();

			app.Run();
		}
	}
}