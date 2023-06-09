using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class LoginForm
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
