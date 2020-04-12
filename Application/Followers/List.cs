using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<IEnumerable<Profile>>
        {
            public string UserName { get; set; }

            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, IEnumerable<Profile>>
        {
            private readonly DataContext _context;
            private readonly IProfileReader _profileReader;
            public Handler(DataContext context, IProfileReader profileReader)
            {
                this._profileReader = profileReader;
                this._context = context;
            }

            public async Task<IEnumerable<Profile>> Handle(Query query, CancellationToken cancellationToken)
            {
                var queryable = this._context.Followings.AsQueryable();
                var userfollowings = new List<UserFollowing>();
                var userProfiles = new List<Profile>();

                switch (query.Predicate)
                {
                    case "followers":
                    {
                        userfollowings = await queryable.Where(t => t.Target.UserName == query.UserName).ToListAsync();
                        foreach (var follwer in userfollowings)
                        {
                            userProfiles.Add(await this._profileReader.ReadProfile(follwer.Observer.UserName));
                        }
                        break;
                    }
                    case "following":
                    {
                        userfollowings = await queryable.Where(t => t.Observer.UserName == query.UserName).ToListAsync();
                        foreach (var follwer in userfollowings)
                        {
                            userProfiles.Add(await this._profileReader.ReadProfile(follwer.Target.UserName));
                        }
                        break;
                    }
                }

                return userProfiles;

            }
        }
    }
}