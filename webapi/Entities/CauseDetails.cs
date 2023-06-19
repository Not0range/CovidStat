using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Entities
{
    [Table("CausesDetails")]
    public class CauseDetails
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(CauseType))]
        public int CauseTypeId { get; set; }
        public CauseType CauseType { get; set; }
        [ForeignKey(nameof(Disease))]
        public int DiseaseId { get; set; }
        public Disease Disease { get; set; }
        [Required]
        public string Details { get; set; }
        [Required]
        public bool DefaultValue { get; set; }
    }
}
