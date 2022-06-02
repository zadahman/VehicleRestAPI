using System.Collections.Generic;
using System.Threading.Tasks;
using VehicleRestAPI.Models;

namespace VehicleRestAPI.Repositories
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