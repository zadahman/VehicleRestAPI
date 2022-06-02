using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleRestAPI.Models;
using VehicleRestAPI.Repositories;

namespace VehicleRestAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleRepository _vehicleContext;

        public VehicleController(IVehicleRepository context)
        {
            _vehicleContext = context;
        }

        // GET: api/VehicleRestAPI
        [HttpGet]
        public async Task<IEnumerable<Vehicle>> GetVehicles()
        {
            return await _vehicleContext.Get();
        }

        // GET: api/VehicleRestAPI/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(int id)
        {
            var vehicle = await _vehicleContext.Get(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            return vehicle;
        }

        // PUT: api/VehicleRestAPI/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        public async Task<IActionResult> PutVehicle(Vehicle vehicle)
        {
            try
            {
                await _vehicleContext.Update(vehicle);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(vehicle.Id))
                {
                    return NotFound();
                }
            }

            return NoContent();
        }

        // POST: api/VehicleRestAPI
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Vehicle>> PostVehicle(Vehicle vehicle)
        {
            var newVehicle = await _vehicleContext.Create(vehicle);

            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, newVehicle);
        }

        // DELETE: api/VehicleRestAPI/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVehicle(int id)
        {
            if (VehicleExists(id))
            {
                await _vehicleContext.Delete(id);
                return Ok();
            }

            return NotFound();
        }

        private bool VehicleExists(int id)
        {
            var vehicle = _vehicleContext.Get(id).Result;
            return vehicle != null;
        }
    }
}
