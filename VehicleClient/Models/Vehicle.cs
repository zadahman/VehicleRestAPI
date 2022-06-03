using System.ComponentModel.DataAnnotations;

namespace VehicleClient.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }
        [Range(1950, 2050,
            ErrorMessage = "Value for {0} must be between {1} and {2}")]
        public int Year { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        public string Model { get; set; }
    }
}
