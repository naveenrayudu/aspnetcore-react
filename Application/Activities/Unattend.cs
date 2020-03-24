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

namespace Application.Activities
{
    public class Unattend
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }  
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._context = context;
                this._userAccessor = userAccessor;
            }
        
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await this._context.Users.SingleOrDefaultAsync(t => t.UserName == this._userAccessor.GetCurrentUserName());
                var userActivityToRemove = await this._context.UserActivities.SingleOrDefaultAsync(t => t.ActivityId == request.Id && t.AppUserId == user.Id);

                if(userActivityToRemove == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new {
                        Attendance = "Cannot find attendance"
                    });
                }

                if(userActivityToRemove.IsHost) {
                     throw new RestException(HttpStatusCode.BadRequest, new {
                        Attendance = "You cannot remove yourself as host"
                    });
                }

                this._context.UserActivities.Remove(userActivityToRemove);

                if(await this._context.SaveChangesAsync() > 0)
                       return Unit.Value;
        
                 throw new Exception("Problem occured while removing the activity");      
        
            }
        }
    }
}