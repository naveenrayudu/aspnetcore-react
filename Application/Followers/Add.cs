using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Add
    {
        public class Command : IRequest
        {
            public string UserName { get; set; }
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var usersInfo = await this._context.Users.Where(t => t.UserName == request.UserName || t.UserName == this._userAccessor.GetCurrentUserName())
                                    .ToListAsync();
                
                var observer = usersInfo.FirstOrDefault(t => t.UserName == this._userAccessor.GetCurrentUserName());
                var target = usersInfo.FirstOrDefault(t => t.UserName == request.UserName);

                if(target == null) {
                     throw new RestException(HttpStatusCode.NotFound, new {
                        User = "User not found"
                    });
                }

                if(await this._context.Followings.AnyAsync(t => t.ObserverId == observer.Id && t.TargetId == target.Id))
                {
                    throw new RestException(HttpStatusCode.UnprocessableEntity, new {
                        Following = "Already following the follower"
                    });
                }

                var following = new UserFollowing()
                {
                    Target = target,
                    Observer = observer
                };

                this._context.Followings.Add(following);

                if (await this._context.SaveChangesAsync() > 0)
                    return Unit.Value;

                throw new Exception("Problem occured while saving the request");

            }
        }
    }
}