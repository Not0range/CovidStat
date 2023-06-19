using webapi.Models.Input;

namespace webapi.Models.Output
{
    public class SummaryModel
    {
        public int DiseaseId { get; set; }
        public string Disease { get; set; }
        public SummaryForm Query { get; set; }
        public IEnumerable<CauseModel> Causes { get; set; }
    }
}
