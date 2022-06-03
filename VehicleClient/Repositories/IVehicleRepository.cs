using System.Collections.Generic;
using System.Threading.Tasks;
using VehicleClient.Models;

namespace VehicleClient.Repositories
{
    public interface IVehicleRepository
    {
        Task<IEnumerable<Vehicle>> Get();

        Task<Vehicle> Get(int id);

        Task<Vehicle> Create(Vehicle vehicle);

        Task Update(Vehicle vehicle);

        Task Delete(int id);   
    }
}