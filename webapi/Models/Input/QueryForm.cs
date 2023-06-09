namespace webapi.Models.Input
{
    public class QueryForm
    {
        public DateTime? BeginDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? Gender { get; set; }
        public int? BeginAge { get; set; }
        public int? EndAge { get; set; }
        public int? DistrictId { get; set; }
        public int? CityId { get; set; }
    }
}
