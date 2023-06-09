using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost]
        public ActionResult<StatsModel> Query([FromBody] QueryForm form)
        {
            IQueryable<Cause> data = _ctx.Causes.Include(t => t.CauseType);

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

            var result = data.GroupBy(t => t.CauseType, (key, group) =>  new CauseModel
            {
                Title = key.Title,
                Value = group.Count()
            });

            return new StatsModel
            {
                Query = form,
                Causes = result
            };
        }
    }
}
