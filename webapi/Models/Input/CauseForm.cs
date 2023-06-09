using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class CauseForm
    {
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public int CityId { get; set; }
        [Required]
        public int Age { get; set; }
        [Required]
        public bool Gender { get; set; }
        [Required]
        public int TypeId { get; set; }
    }
}
