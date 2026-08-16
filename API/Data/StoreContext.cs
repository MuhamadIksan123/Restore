using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {
        public required DbSet<Product> Products { get; set; }
        public required DbSet<Basket> Baskets { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole> ()
            .HasData(
                new IdentityRole {Id = "3fdd1639-52ae-477a-ba10-348b46a8e433", ConcurrencyStamp = "Member", Name = "Member", NormalizedName = "MEMBER"},
                new IdentityRole {Id = "bc360ca3-9ce3-465f-aae6-12d16eaa28e2", ConcurrencyStamp = "Admin", Name = "Admin", NormalizedName = "ADMIN"}
            );
        }
    }
}