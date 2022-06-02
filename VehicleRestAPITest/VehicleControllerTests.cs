using System.Collections.Generic;
using System.Linq;
using Moq;
using NUnit.Framework;
using VehicleRestAPI.Controllers;
using VehicleRestAPI.Models;
using VehicleRestAPI.Repositories;

namespace VehicleRestAPITest
{
    public class VehicleControllerTests
    {
        private VehicleController _controller;
        private List<Vehicle> _vehicles;
        
        [SetUp]
        public void Setup()
        {
            var mockRepo = new Mock<IVehicleRepository>();
            _vehicles = GetMockVehicles();
            
            mockRepo.Setup(repo => repo.Get()).ReturnsAsync(_vehicles);
            
            mockRepo.Setup(repo => repo.Get(It.IsAny<int>())).ReturnsAsync((int x) =>
            {
                return _vehicles.FirstOrDefault(v => v.Id.Equals(x));
            });
            
            mockRepo.Setup(repo => repo.Create(It.IsAny<Vehicle>())).ReturnsAsync((Vehicle x) =>
            {
                x.Id = _vehicles.Count + 1;
                _vehicles.Add(x);
                return x;
            });
            
            mockRepo.Setup(repo => repo.Update(It.IsAny<Vehicle>())).Callback((Vehicle v) =>
            {
                _vehicles.ForEach(vehicle =>
                {
                    if (vehicle.Id.Equals(v.Id))
                    {
                        vehicle.Year = v.Year;
                    }
                });
            });
            
            mockRepo.Setup(repo => repo.Delete(It.IsAny<int>())).Callback((int id) =>
            {
                var temp = _vehicles.FirstOrDefault(x => x.Id == id);
                _vehicles.Remove(temp);
            });
            
            _controller = new VehicleController(mockRepo.Object);
        }

        [Test]
        public void EnsureGetAllVehicles()
        {
            var vehicles = _controller.GetVehicles();
            Assert.That(vehicles.Result.Count().Equals(2));
        }
        
        [Test]
        public void EnsureGetAVehicle()
        {
            var mercedes = _controller.GetVehicle(2).Result.Value;
            Assert.That(mercedes != null);
            var vehicle = GetMockVehicles()[1];
            Assert.That(mercedes.Make.Equals(vehicle.Make));
            Assert.That(vehicle.Model.Equals(vehicle.Model));
            Assert.That(vehicle.Year.Equals(vehicle.Year));
        }
        
        [Test]
        public void EnsurePostVehicle()
        {
            var newVehicle = new Vehicle() {Make = "Mazda", Model = "CX-30", Year = 2022};
            _controller.PostVehicle(newVehicle);
            
            var vehicles = _controller.GetVehicles().Result;
            Assert.That(vehicles.Count().Equals(3));
            
            var mazda = _controller.GetVehicle(3).Result.Value;
            Assert.That(mazda != null);
            Assert.That(mazda.Make.Equals(newVehicle.Make));
            Assert.That(mazda.Model.Equals(newVehicle.Model));
            Assert.That(mazda.Year.Equals(newVehicle.Year));
        }
        
        [Test]
        public void EnsureUpdateVehicleYear()
        {
            var updateVehicle = new Vehicle() {Id=1, Make = "Ford", Model = "Fusion", Year = 2022};
            _controller.PutVehicle(updateVehicle);

            var updatedFord = _controller.GetVehicle(1).Result.Value;
            Assert.That(updatedFord != null);
            Assert.That(updatedFord.Year.Equals(updateVehicle.Year));
        }
        
        [Test]
        public void EnsureDeleteVehicle()
        {
            _controller.DeleteVehicle(1);

            var vehicle = _controller.GetVehicles().Result;
            Assert.That(vehicle.Count().Equals(1));
        }
        
        private List<Vehicle> GetMockVehicles()
        {
            return new List<Vehicle>
            {
                new()
                {
                    Id = 1,
                    Make = "Ford",
                    Model = "Fusion",
                    Year = 2017
                },
                new()
                {
                    Id = 2,
                    Make = "Mercedes",
                    Model = "GLA 250 SUV",
                    Year = 2022
                }
            };
        }
    }
}