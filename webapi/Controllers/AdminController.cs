using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Cryptography;
using System.Text;

using webapi.Entities;
using webapi.Models.Input;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController, Authorize]
    public class AdminController : ControllerBase
    {
        private readonly CovidContext _ctx;

        public AdminController(CovidContext ctx)
        {
            _ctx = ctx;
        }

        [HttpPost("/district")]
        public async Task<ActionResult> AddDistrict([FromBody] string title)
        {
            var d = await _ctx.Districts.FirstOrDefaultAsync(t => t.Title.ToLower() == title.ToLower());
            if (d != null) return BadRequest();

            await _ctx.Districts.AddAsync(new Entities.District { Title = title });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("/district")]
        public async Task<ActionResult> RemoveDistrict([FromBody] int id)
        {
            var d = await _ctx.Districts.FirstOrDefaultAsync(t => t.Id == id);
            if (d == null) return NotFound();

            _ctx.Districts.Remove(d);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("/city")]
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

        [HttpDelete("/city")]
        public async Task<ActionResult> RemoveCity([FromBody] int id)
        {
            var c = await _ctx.Cities.FirstOrDefaultAsync(t => t.Id == id);
            if (c == null) return NotFound();

            _ctx.Cities.Remove(c);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("/type")]
        public async Task<ActionResult> AddType([FromBody] string title)
        {
            var t = await _ctx.CauseTypes.FirstOrDefaultAsync(t => t.Title.ToLower() == title.ToLower());
            if (t != null) return BadRequest();

            await _ctx.CauseTypes.AddAsync(new Entities.CauseType { Title = title });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("/type")]
        public async Task<ActionResult> RemoveType([FromBody] int id)
        {
            var t = await _ctx.CauseTypes.FirstOrDefaultAsync(t => t.Id == id);
            if (t == null) return NotFound();

            _ctx.CauseTypes.Remove(t);
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("/cause")]
        public async Task<ActionResult> AddCause([FromBody] CauseForm form)
        {
            var c = await _ctx.Cities.FirstOrDefaultAsync(t => t.Id == form.CityId);
            var t = await _ctx.CauseTypes.FirstOrDefaultAsync(t => t.Id == form.TypeId);
            if (c == null || t == null) return BadRequest();

            await _ctx.Causes.AddAsync(new Entities.Cause
            {
                Date = form.Date,
                CityId = form.CityId,
                Age = form.Age,
                Gender = form.Gender,
                TypeId = form.TypeId
            });
            await _ctx.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("/cause")]
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

            await _ctx.CauseTypes.AddRangeAsync(new string[] { "Заболело", "Выздоровело", "Умерло" }
                .Select(t => new CauseType { Title = t }).ToArray());
            await _ctx.SaveChangesAsync();

            await _ctx.Districts.AddRangeAsync(new string[] { "Тирасполь", "Бендеры", "Слободзейский район" }
                .Select(t => new District { Title = t }));
            await _ctx.SaveChangesAsync();

            await _ctx.Cities.AddAsync(new City { DistrictId = 1, Title = "Тирасполь" });
            await _ctx.Cities.AddAsync(new City { DistrictId = 2, Title = "Бендеры" });
            await _ctx.Cities.AddAsync(new City { DistrictId = 3, Title = "Слободзея" });
            await _ctx.Cities.AddAsync(new City { DistrictId = 3, Title = "Днестровск" });
            await _ctx.SaveChangesAsync();

            var rand = new Random();
            var b = new DateTime(2022, 1, 1);
            for (var i = 0; i < 730; i = i++)
            {
                for (int j = 0; j < 10; j++)
                {
                    await _ctx.Causes.AddAsync(new Cause
                    {
                        Date = b.AddDays(i),
                        CityId = rand.Next(1, 5),
                        Age = 120 + rand.Next(50) * 12,
                        Gender = rand.Next(2) == 1,
                        TypeId = rand.Next(1, 4)
                    });
                }
                await _ctx.SaveChangesAsync();
            }

            return Ok();
        }
    }
}
