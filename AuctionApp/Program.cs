using AuctionApp.Models;
using Microsoft.EntityFrameworkCore;
using AuctionApp.Controllers;
using Microsoft.AspNetCore.OpenApi;
using AuctionApp.Hubs;
using MySql.Data.MySqlClient;
using Npgsql;

DotNetEnv.Env.Load();

var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DatabaseContext>(
      opt =>
    {
        opt.UseNpgsql(connectionString);


    }
);

builder.Services.AddControllers();

builder.Services.AddSignalR();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.MapHub<AuctionHub>("/r/auctionHub");


app.MapGet("/test", () => "Hello World!");

app.UseDefaultFiles(); // For the wwwroot folder
app.UseStaticFiles();
app.MapFallbackToFile("index.html"); // if no static files are found, try to serve a Razor Page or a Blazor component

app.Run();
