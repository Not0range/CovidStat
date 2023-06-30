using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class AdminController : ControllerBase
    {
        private readonly CovidContext _ctx;
        private readonly ILogger _logger;

        public AdminController(CovidContext ctx, ILogger<AdminController> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        [HttpPost("District")]
        public async Task<ActionResult> AddDistrict([FromBody] string title)
        {
            var d = await _ctx.Districts.FirstOrDefaultAsync(t => t.Title.ToLower() == title.ToLower());
            if (d != null) return BadRequest();

            await _ctx.Districts.AddAsync(new District { Title = title });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("District")]
        public async Task<ActionResult> RemoveDistrict([FromBody] int id)
        {
            var d = await _ctx.Districts.FirstOrDefaultAsync(t => t.Id == id);
            if (d == null) return NotFound();

            _ctx.Districts.Remove(d);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("City")]
        public async Task<ActionResult> AddCity([FromBody] CityForm form)
        {
            var d = await _ctx.Districts.FirstOrDefaultAsync(t => t.Id == form.DistrictId);
            if (d == null) return BadRequest();

            await _ctx.Cities.AddAsync(new Entities.City
            {
                DistrictId = form.DistrictId,
                Title = form.Title
            });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("City")]
        public async Task<ActionResult> RemoveCity([FromBody] int id)
        {
            var c = await _ctx.Cities.FirstOrDefaultAsync(t => t.Id == id);
            if (c == null) return NotFound();

            _ctx.Cities.Remove(c);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("Type")]
        public async Task<ActionResult> AddType([FromBody] string title)
        {
            var t = await _ctx.CauseTypes.FirstOrDefaultAsync(t => t.Title.ToLower() == title.ToLower());
            if (t != null) return BadRequest();

            t = new CauseType { Title = title };
            await _ctx.CauseTypes.AddAsync(t);
            await _ctx.SaveChangesAsync();

            await _ctx.CausesDetails.AddRangeAsync(_ctx.Diseases.ToList().Select(d => new CauseDetails
            {
                CauseTypeId = t.Id,
                DiseaseId = d.Id,
                Details = "-",
                DefaultValue = true
            }));
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("Type")]
        public async Task<ActionResult> RemoveType([FromBody] int id)
        {
            var t = await _ctx.CauseTypes.FirstOrDefaultAsync(t => t.Id == id);
            if (t == null) return NotFound();

            _ctx.CauseTypes.Remove(t);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("Disease")]
        public async Task<ActionResult> AddDisease([FromBody] string title)
        {
            var d = await _ctx.Diseases.FirstOrDefaultAsync(t => t.Title.ToLower() == title.ToLower());
            if (d != null) return BadRequest();

            d = new Disease { Title = title };
            await _ctx.Diseases.AddAsync(d);
            await _ctx.SaveChangesAsync();

            await _ctx.CausesDetails.AddRangeAsync(_ctx.CauseTypes.ToList().Select(t => new CauseDetails
            {
                CauseTypeId = t.Id,
                DiseaseId = d.Id,
                Details = "-",
                DefaultValue = true
            }));
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("Disease")]
        public async Task<ActionResult> RemoveDisease([FromBody] int id)
        {
            var d = await _ctx.Diseases.FirstOrDefaultAsync(t => t.Id == id);
            if (d == null) return NotFound();

            _ctx.Diseases.Remove(d);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("Details")]
        public async Task<ActionResult> AddDetails([FromBody] DetailsForm form)
        {
            var d = await _ctx.CausesDetails.Where(t => t.DiseaseId == form.DiseaseId && t.CauseTypeId == form.TypeId)
                .FirstOrDefaultAsync(t => t.Details.ToLower() == form.Details.ToLower());
            if (d != null) return BadRequest();

            await _ctx.CausesDetails.AddAsync(new CauseDetails
            {
                DiseaseId = form.DiseaseId,
                CauseTypeId = form.TypeId,
                Details = form.Details
            });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("Details")]
        public async Task<ActionResult> RemoveDetails([FromBody] int id)
        {
            var d = await _ctx.CausesDetails.FirstOrDefaultAsync(t => t.Id == id);
            if (d == null) return NotFound();

            _ctx.CausesDetails.Remove(d);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("Cause")]
        public async Task<ActionResult> AddCause([FromBody] CauseForm form)
        {
            var c = await _ctx.Cities.FirstOrDefaultAsync(t => t.Id == form.CityId);
            var t = await _ctx.CauseTypes.FirstOrDefaultAsync(t => t.Id == form.DetailsId);
            if (c == null || t == null) return BadRequest();

            await _ctx.Causes.AddAsync(new Cause
            {
                Date = form.Date,
                CityId = form.CityId,
                Age = form.Age,
                Gender = form.Gender,
                DetailsId = form.DetailsId
            });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("Cause")]
        public async Task<ActionResult> RemoveCause([FromBody] int id)
        {
            var t = await _ctx.Causes.FirstOrDefaultAsync(t => t.Id == id);
            if (t == null) return NotFound();

            _ctx.Causes.Remove(t);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("[action]")]
        public async Task<ActionResult> Init()
        {
            if (await _ctx.Users.AnyAsync()) return BadRequest();

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes("admin"));
            var hash = Encoding.UTF8.GetString(await sha.ComputeHashAsync(stream));
            stream.Close();

            await _ctx.Users.AddAsync(new User
            {
                Username = "admin",
                Password = hash
            });
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("User added");

            await _ctx.CauseTypes.AddRangeAsync(new string[] { "Заболело", "Выздоровело", "Умерло", "Вакцинировано" }
                .Select(t => new CauseType { Title = t }).ToArray());
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Cause types added");

            await _ctx.Diseases.AddRangeAsync(new string[] { "Covid-19", "Грипп", "Корь" }
                .Select(t => new Disease { Title = t }).ToArray());
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Diseases added");

            for (int i = 1; i <= 3; i++)
            {
                for (int j = 1; j <= 4; j++)
                {
                    await _ctx.CausesDetails.AddAsync(new CauseDetails
                    {
                        DiseaseId = i,
                        CauseTypeId = j,
                        Details = "-",
                        DefaultValue = true
                    });
                }
            }
            await _ctx.SaveChangesAsync();

            await _ctx.CausesDetails.AddRangeAsync(new CauseDetails[]
            {
                new CauseDetails {DiseaseId = 1, CauseTypeId = 4, Details = "Спутник V", DefaultValue = false},
                new CauseDetails {DiseaseId = 1, CauseTypeId = 4, Details = "AstraZeneca", DefaultValue = false},
            });
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Cause details added");

            var dir = new DirectoryInfo(@"InitialData\Districts");
            await _ctx.Districts.AddRangeAsync(dir.GetFiles()
                .Select(t => new District { Title = Regex.Match(t.Name, @"^\d\.(.+)\.txt$").Groups[1].Value }));
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Districts added");

            foreach (var file in dir.GetFiles())
            {
                await _ctx.Cities.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(file.FullName)).Select(t => new City
                {
                    DistrictId = int.Parse(file.Name.Substring(0, 1)),
                    Title = t
                }));
            }
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Cities added");

            var cityCount = await _ctx.Cities.CountAsync();
            var vaccine = _ctx.CausesDetails.Where(t => t.DiseaseId == 1 && !t.DefaultValue && t.CauseTypeId == 4).ToList();

            var reader = System.IO.File.OpenText(@"InitialData\summary.txt");
            var rand = new Random();

            string[] strs;
            int[] values;
            while (!reader.EndOfStream)
            {
                strs = (await reader.ReadLineAsync()).Split('\t');
                values = strs.Skip(1).Select(t => string.IsNullOrWhiteSpace(t) ? 0 : int.Parse(t)).ToArray();

                for (int i = 0; i < values[0]; i++)
                {
                    await _ctx.Causes.AddAsync(new Cause
                    {
                        Date = DateTime.Parse(strs[0]),
                        CityId = rand.Next(cityCount) + 1,
                        Age = getAge(rand),
                        Gender = rand.Next(2) == 1,
                        DetailsId = 1
                    });
                }
                await _ctx.SaveChangesAsync();
                for (int i = 0; i < values[1]; i++)
                {
                    await _ctx.Causes.AddAsync(new Cause
                    {
                        Date = DateTime.Parse(strs[0]),
                        CityId = rand.Next(cityCount) + 1,
                        Age = getAge(rand),
                        Gender = rand.Next(2) == 1,
                        DetailsId = 3
                    });
                }
                await _ctx.SaveChangesAsync();
                for (int i = 0; i < values[2]; i++)
                {
                    await _ctx.Causes.AddAsync(new Cause
                    {
                        Date = DateTime.Parse(strs[0]),
                        CityId = rand.Next(cityCount) + 1,
                        Age = getAge(rand),
                        Gender = rand.Next(2) == 1,
                        DetailsId = 2
                    });
                }
                await _ctx.SaveChangesAsync();

                var v = rand.Next((int)Math.Ceiling(values[2] * 0.15));
                for (int i = 0; i < v; i++)
                {
                    await _ctx.Causes.AddAsync(new Cause
                    {
                        Date = DateTime.Parse(strs[0]),
                        CityId = rand.Next(cityCount) + 1,
                        Age = getAge(rand),
                        Gender = rand.Next(2) == 1,
                        DetailsId = vaccine[rand.Next(vaccine.Count)].Id
                    });
                }
                await _ctx.SaveChangesAsync();
                _logger.LogWarning($"Causes added ({strs[0]})");
            }
            var b = new DateTime(2022, 1, 1);
            for (var i = 0; i < 730; i++)
            {
                for (int j = 0; j < 20; j++)
                {
                    int details = 0;
                    int type;
                    int disease = rand.Next(0, 3);
                    int t = rand.Next(6);
                    if (t < 3) type = 1;
                    else if (t == 3) type = 2;
                    else if (t == 4) type = 3;
                    else
                    {
                        type = 4;
                        if (disease == 0)
                        {
                            if (rand.Next(2) == 1) details = 13;
                            else details = 14;
                        }
                    }
                    if (details == 0) details = disease * 4 + type;

                    await _ctx.Causes.AddAsync(new Cause
                    {
                        Date = b.AddDays(i),
                        CityId = rand.Next(1, 5),
                        Age = 120 + rand.Next(50) * 12,
                        Gender = rand.Next(2) == 1,
                        DetailsId = details
                    });
                }
                await _ctx.SaveChangesAsync();
            }

            return Ok();
        }

        int getAge(Random rand)
        {
            var index = rand.Next(10);
            if (index < 5) return rand.Next(50, 101);
            else if (index < 8) return rand.Next(16);
            else return rand.Next(16, 50);
        }
    }
}
