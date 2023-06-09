using webapi.Models.Input;

namespace webapi.Models.Output
{
    public class StatsModel
    {
        public QueryForm Query { get; set; }
        public IEnumerable<CauseModel> Causes { get; set; }
    }
}
