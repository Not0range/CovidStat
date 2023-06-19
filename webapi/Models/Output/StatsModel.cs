using webapi.Models.Input;

namespace webapi.Models.Output
{
    public class StatsModel
    {
        public int DiseaseId { get; set; }
        public string Disease { get; set; }
        public QueryForm Query { get; set; }
        public IEnumerable<StatsItem> Causes { get; set; }
    }

    public class StatsItem
    {
        public string Key { get; set; }
        public IEnumerable<KeyValuePair<string, int>> Values { get; set; }
    }
}
