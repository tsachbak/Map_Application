
using server.Handlers.MapDataHandler;
using server.Services.ObjectsService;
using server.Services.PolygonsService;
using server.Settings;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var allowedOriginsPolicyName = "ClientCors";

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.Configure<MongoSettings>(
                builder.Configuration.GetSection("Mongo"));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(allowedOriginsPolicyName, policy =>
                {
                    policy
                        .WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            builder.Services.AddSingleton<Services.MongoDbService>();
            builder.Services.AddScoped<IObjectsService, ObjectsService>();
            builder.Services.AddScoped<IPolygonsService, PolygonsService>();
            builder.Services.AddScoped<IMapDataHandler, MapDataHandler>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(allowedOriginsPolicyName);

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
