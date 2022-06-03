using Microsoft.EntityFrameworkCore;

namespace VehicleClient.Models
{
    public class VehicleContext : DbContext
    {
        public VehicleContext(DbContextOptions<VehicleContext> options): base(options)
        {
        }

        public DbSet<Vehicle> Vehicles { get; set; } 
    }
}
