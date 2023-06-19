using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Entities
{
    [Table("Causes")]
    public class Cause
    {
        [Key]
        public int Id { get; set; }
        [Required, Column(TypeName = "date")]
        public DateTime Date { get; set; }
        [ForeignKey(nameof(City))]
        public int CityId { get; set; }
        public City City { get; set; }
        [Required]
        public int Age { get; set; }
        [Required]
        public bool Gender { get; set; }
        [ForeignKey(nameof(CauseDetails))]
        public int DetailsId { get; set; }
        public CauseDetails CauseDetails { get; set; }
    }
}
