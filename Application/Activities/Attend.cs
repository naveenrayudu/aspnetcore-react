using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Attend
    {
        public class Command : IRequest
        {
            public Guid Id {get; set;} 
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
                var activity = await this._context.Activities.FindAsync(request.Id);

                if(activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new {
                        Activity = "Could not find activity"
                    });

                var user = await this._context.Users.SingleAsync(t => t.UserName == this._userAccessor.GetCurrentUserName());
                var attendee = await this._context.UserActivities.SingleOrDefaultAsync(t => t.AppUserId == user.Id && t.ActivityId == activity.Id);

                if(attendee != null)
                    throw new RestException(HttpStatusCode.BadRequest, new {
                        Attendance = "Already attending this event"
                    });

                var newAttendee = new UserActivity
                {
                    Activity = activity,
                    AppUser = user,
                    DateJoined =  DateTime.UtcNow,
                    IsHost = false
                };

                _context.UserActivities.Add(newAttendee);


                if(await this._context.SaveChangesAsync() > 0)
                       return Unit.Value;
        
                 throw new Exception("Problem occured while saving the request");      
        
            }
        }
    }
}