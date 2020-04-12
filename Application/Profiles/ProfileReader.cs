using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            this._userAccessor = userAccessor;
            this._context = context;
        }

        public async Task<Profile> ReadProfile(string username)
        {
            var usersInfo = await this._context.Users.Where(t => t.UserName == username || t.UserName == this._userAccessor.GetCurrentUserName())
                                    .ToListAsync();
                
            var currentuser = usersInfo.FirstOrDefault(t => t.UserName == this._userAccessor.GetCurrentUserName());
            var user = usersInfo.FirstOrDefault(t => t.UserName == username);

            if(user == null)
            {
                throw new RestException(HttpStatusCode.NotFound, new {
                    User = "User not found."
                });
            }

            return new Profile
                  {
                      UserName = user.UserName,
                      DisplayName = user.DisplayName,
                      Bio = user.Bio,
                      Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                      Photos = user.Photos,
                      FollowersCount = user.Followers.Count(),
                      FollowingCount = user.Followings.Count(),
                      IsFollowing = currentuser.Followings.Any(t => t.TargetId == user.Id)
                  };
        }
    }
}