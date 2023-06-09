using Microsoft.EntityFrameworkCore;

using webapi.Entities;

namespace webapi
{
    public class CovidContext : DbContext
    {
        public CovidContext(): base() { }
        public CovidContext(DbContextOptions<CovidContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<CauseType> CauseTypes { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Cause> Causes { get; set; }
    }
}
