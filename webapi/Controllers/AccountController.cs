using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using webapi.Models.Input;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly CovidContext _ctx;
        public AccountController(CovidContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet("[action]"), Authorize]
        public async Task<ActionResult<string>> Check()
        {
            var username = User.Claims.FirstOrDefault(t => t.Type == ClaimTypes.GivenName)?.Value;
            if (username == null)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Unauthorized();
            }
            return username;
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<string>> Login([FromForm] LoginForm form)
        {
            var user = await _ctx.Users.AsNoTracking()
                .FirstOrDefaultAsync(t => t.Username == form.Username.ToLower());
            if (user == null) return NotFound();

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(form.Password));
            var hash = Encoding.UTF8.GetString(await sha.ComputeHashAsync(stream));
            stream.Close();

            if (user.Password != hash)
                return NotFound();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.GivenName, user.Username),
                new Claim(ClaimTypes.Sid, user.Id.ToString())
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity), new AuthenticationProperties
                {
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(1)
                });
            return user.Username;
        }

        [HttpGet("[action]"), Authorize]
        public async Task<ActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }
    }
}
