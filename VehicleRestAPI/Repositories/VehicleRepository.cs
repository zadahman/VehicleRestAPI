using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VehicleRestAPI.Models;

namespace VehicleRestAPI.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly VehicleContext _context;

        public VehicleRepository(VehicleContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vehicle>> Get()
        {
            return await _context.Vehicles.ToListAsync();
        }

        public async Task<Vehicle> Get(int id)
        {
            return await _context.Vehicles.FindAsync(id);
        }

        public async Task<Vehicle> Create(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task Update(Vehicle vehicle)
        {
            _context.Entry(vehicle).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var vehicleToDelete = await _context.Vehicles.FindAsync(id);
            _context.Vehicles.Remove(vehicleToDelete);
            await _context.SaveChangesAsync();
        }
    }
}