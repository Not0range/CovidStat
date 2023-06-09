using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class CityForm
    {
        [Required]
        public int DistrictId { get; set; }
        [Required]
        public string Title { get; set; }
    }
}
