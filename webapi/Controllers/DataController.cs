using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Linq;

using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private readonly CovidContext _ctx;

        public DataController(CovidContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet("[action]")]
        public ActionResult<IEnumerable<CauseType>> CauseTypes()
        {
            return _ctx.CauseTypes;
        }

        [HttpGet("[action]")]
        public ActionResult<IEnumerable<District>> Districts()
        {
            return _ctx.Districts;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<CityModel>>> Cities()
        {
            return await _ctx.Cities.Select(t => new CityModel
            {
                Id = t.Id,
                DistrictId = t.DistrictId,
                District = t.District.Title,
                Title = t.Title
            }).ToListAsync();
        }

        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Disease>> Diseases()
        {
            return _ctx.Diseases;
        }

        [HttpGet("[action]")]
        public ActionResult<IEnumerable<DetailsModel>> Details()
        {
            return Ok(_ctx.CausesDetails.Select(t => new DetailsModel
            {
                Id = t.Id,
                CauseTypeId = t.CauseTypeId,
                CauseType = t.CauseType.Title,
                DiseaseId = t.DiseaseId,
                Disease = t.Disease.Title,
                Details = t.Details
            }));
        }

        [HttpPost("[action]/{id}")]
        public async Task<ActionResult<SummaryModel>> Summary(int id, [FromBody] SummaryForm form)
        {
            if (!await _ctx.Diseases.AnyAsync(t => t.Id == id)) return BadRequest();

            IQueryable<Cause> data = _ctx.Causes
                .Where(t => t.CauseDetails.DiseaseId == id)
                .Include(t => t.CauseDetails).Include(t => t.CauseDetails.CauseType)
                .Include(t => t.City);


            if (form.BeginDate.HasValue)
                data = data.Where(t => t.Date >= form.BeginDate.Value);
            if (form.EndDate.HasValue)
                data = data.Where(t => t.Date <= form.EndDate.Value);
            if (form.Gender.HasValue)
                data = data.Where(t => t.Gender == form.Gender.Value);
            if (form.BeginAge.HasValue)
                data = data.Where(t => t.Age >= form.BeginAge.Value);
            if (form.EndAge.HasValue)
                data = data.Where(t => t.Age <= form.EndAge.Value);
            if (form.CityId.HasValue)
                data = data.Where(t => t.CityId == form.CityId.Value);
            else if (form.DistrictId.HasValue)
                data = data.Where(t => t.City.DistrictId == form.DistrictId.Value);


            var result = data.GroupBy(t => t.CauseDetails.Id).Select(t => new CauseModel
            {
                Id = t.First().CauseDetails.CauseTypeId,
                Title = t.First().CauseDetails.CauseType.Title,
                Details = t.First().CauseDetails.DefaultValue ? null : t.First().CauseDetails.Details,
                Value = t.Count()
            }).OrderBy(t => t.Id);

            return new SummaryModel
            {
                DiseaseId = id,
                Disease = _ctx.Diseases.First(t => t.Id == id).Title,
                Query = form,
                Causes = result
            };
        }

        [HttpPost("[action]/{id}")]
        public async Task<ActionResult<StatsModel>> Query(int id, [FromBody] QueryForm form, [FromQuery] bool details = false)
        {
            if (!await _ctx.Diseases.AnyAsync(t => t.Id == id)) return BadRequest();

            var types = _ctx.CauseTypes.ToList();
            var causeDetails = _ctx.CausesDetails.Include(t => t.CauseType)
                .Where(t => t.DiseaseId == id).ToList();

            IQueryable<Cause> data = _ctx.Causes
                .Where(t => t.CauseDetails.DiseaseId == id)
                .Include(t => t.CauseDetails).Include(t => t.CauseDetails.CauseType)
                .Include(t => t.City).Include(t => t.City.District);


            if (form.BeginDate.HasValue)
                data = data.Where(t => t.Date >= form.BeginDate.Value);
            if (form.EndDate.HasValue)
                data = data.Where(t => t.Date <= form.EndDate.Value);
            if (form.XAxis != XAxis.Gender && form.Gender.HasValue)
                data = data.Where(t => t.Gender == form.Gender.Value);
            if (form.BeginAge.HasValue)
                data = data.Where(t => t.Age >= form.BeginAge.Value);
            if (form.EndAge.HasValue)
                data = data.Where(t => t.Age <= form.EndAge.Value);
            if (form.XAxis != XAxis.City && form.CityId.HasValue)
                data = data.Where(t => t.CityId == form.CityId.Value);
            else if (form.XAxis != XAxis.District && form.DistrictId.HasValue)
                data = data.Where(t => t.City.DistrictId == form.DistrictId.Value);

            IEnumerable<StatsItem> r = Array.Empty<StatsItem>();
            switch (form.XAxis)
            {
                case XAxis.Date:
                    r = data.GroupBy(t => t.Date).AsEnumerable().Select(t => new StatsItem
                    {
                        Key = t.Key.ToShortDateString(),
                        Values = details ? _createDictWithDetails(t, causeDetails) : _createDict(t, types)
                    });
                    break;
                case XAxis.Age:
                    r = data.GroupBy(t => t.Age).AsEnumerable().Select(t => new StatsItem
                    {
                        Key = t.Key.ToString(),
                        Values = details ? _createDictWithDetails(t, causeDetails) : _createDict(t, types)
                    });
                    break;
                case XAxis.Gender:
                    r = data.GroupBy(t => t.Gender).AsEnumerable().Select(t => new StatsItem
                    {
                        Key = t.Key ? "1" : "0",
                        Values = details ? _createDictWithDetails(t, causeDetails) : _createDict(t, types)
                    });
                    break;
                case XAxis.District:
                    r = data.GroupBy(t => t.City.DistrictId).AsEnumerable().Select(t => new StatsItem
                    {
                        Key = t.First().City.District.Title,
                        Values = details ? _createDictWithDetails(t, causeDetails) : _createDict(t, types)
                    });
                    break;
                case XAxis.City:
                    r = data.GroupBy(t => t.CityId).AsEnumerable().Select(t => new StatsItem
                    {
                        Key = t.First().City.Title,
                        Values = details ? _createDictWithDetails(t, causeDetails) : _createDict(t, types)
                    });
                    break;
            }

            return new StatsModel
            {
                DiseaseId = id,
                Disease = _ctx.Diseases.First(t => t.Id == id).Title,
                Query = form,
                Causes = r
            };
        }

        private IEnumerable<KeyValuePair<string, int>> _createDict<T>(IGrouping<T, Cause> group, IEnumerable<CauseType> types)
        {
            var dict = new Dictionary<string, int>(group.GroupBy(t2 => t2.CauseDetails.CauseType.Id)
                        .Select(t2 => new KeyValuePair<string, int>(t2.First().CauseDetails.CauseType.Title, t2.Count())));
            foreach (var key in types)
                dict.TryAdd(key.Title, 0);
            return dict;
        }

        private IEnumerable<KeyValuePair<string, int>> _createDictWithDetails<T>(IGrouping<T, Cause> group, IEnumerable<CauseDetails> details)
        {
            var dict = new Dictionary<string, int>(group.GroupBy(t2 => t2.CauseDetails.Id)
                        .Select(t2 =>
                        {
                            var d = t2.First().CauseDetails;
                            return new KeyValuePair<string, int>(d.DefaultValue ? d.CauseType.Title : 
                                $"{d.CauseType.Title} - {d.Details}", t2.Count());
                        }));
            foreach (var key in details)
            {
                if (key.DefaultValue && details.Count(t => t.CauseTypeId == key.CauseTypeId) > 1)
                    continue;
                dict.TryAdd(key.DefaultValue ? key.CauseType.Title :
                    $"{key.CauseType.Title} - {key.Details}", 0);
            }
                
            return dict;
        }
}
}
