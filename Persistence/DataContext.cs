using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities {get; set;}

        public DbSet<UserActivity> UserActivities {get; set;}

        public DbSet<Photo> Photos {get; set;}

        public DbSet<Comment> Comments {get; set;}

        public DbSet<UserFollowing> Followings {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Value>().HasData(
                new Value { Id = 1, Name = "Value123" }, 
                new Value { Id = 2, Name = "Value234"}, 
                new Value { Id = 3, Name = "Value345" }
                );
            
            modelBuilder.Entity<UserActivity>(x => x.HasKey(t => new {t.ActivityId, t.AppUserId}));

            modelBuilder.Entity<UserActivity>()
                .HasOne(x => x.AppUser)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(x => x.AppUserId);

            modelBuilder.Entity<UserActivity>()
                .HasOne(x => x.Activity)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(x => x.ActivityId);

            modelBuilder.Entity<UserFollowing>(b => {
                b.HasKey(t => new {t.ObserverId, t.TargetId});

                b.HasOne(t => t.Target)
                    .WithMany(t => t.Followers)
                    .HasForeignKey(t => t.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);

                b.HasOne(t => t.Observer)
                    .WithMany(t => t.Followings)
                    .HasForeignKey(t => t.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
                
        }
    }
}
