using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Delete
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

                var following = await this._context.Followings.FirstOrDefaultAsync(t => t.ObserverId == observer.Id && t.TargetId == target.Id);

                if(following == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {
                        User = "You are not following this user."
                    });
                }

                this._context.Followings.Remove(following);
                
                if (await this._context.SaveChangesAsync() > 0)
                    return Unit.Value;

                throw new Exception("Problem occured while saving the request");

            }
        }
    }
}