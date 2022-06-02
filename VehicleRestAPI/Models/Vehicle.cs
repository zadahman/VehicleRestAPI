using System.ComponentModel.DataAnnotations;

namespace VehicleRestAPI.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }
        public int Year { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }
}
