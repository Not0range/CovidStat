using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using webapi.Entities;

namespace webapi.Models.Output
{
    public class DetailsModel
    {
        public int Id { get; set; }
        public int CauseTypeId { get; set; }
        public string CauseType { get; set; }
        public int DiseaseId { get; set; }
        public string Disease { get; set; }
        public string Details { get; set; }
    }
}
