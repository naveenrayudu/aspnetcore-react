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

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
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

                var user = await this._context.Users.SingleOrDefaultAsync(t => t.UserName == this._userAccessor.GetCurrentUserName());
                var photo = user.Photos.SingleOrDefault(t => t.Id == request.Id);

                if(photo == null) 
                    throw new RestException(HttpStatusCode.NotFound, new {
                        Activity = "Photo doesnt exisit"
                    });
                
                if(photo.IsMain)
                    throw new RestException(HttpStatusCode.BadRequest, new {
                        Activity = "Image is already a main photo"
                    });

                var currentMainPhoto = user.Photos.SingleOrDefault(t => t.IsMain);
                if(currentMainPhoto != null)
                    currentMainPhoto.IsMain = false;

                photo.IsMain = true;

                if (await this._context.SaveChangesAsync() > 0)
                    return Unit.Value;

                throw new Exception("Problem occured while saving the request");

            }
        }
    }
}