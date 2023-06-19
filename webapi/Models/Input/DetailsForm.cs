using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class DetailsForm
    {
        [Required]
        public int TypeId { get; set; }
        [Required]
        public int DiseaseId { get; set; }
        [Required, MinLength(1)]
        public string Details { get; set; }
    }
}
