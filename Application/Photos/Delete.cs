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
    public class Delete
    {
        public class Command : IRequest
        {
            public string PublicId {get; set;}
        }
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhotoAccessor _photoAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                this._photoAccessor = photoAccessor;
                this._userAccessor = userAccessor;
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var result = await this._photoAccessor.DeletePhoto(request.PublicId);
                if(string.IsNullOrWhiteSpace(result)) {
                    throw new RestException(HttpStatusCode.InternalServerError, new {
                        Photos = "Not able to delete the photo"
                    });
                }

                var users = await this._context.Users.SingleOrDefaultAsync(t => t.UserName == this._userAccessor.GetCurrentUserName());
                var photo = users.Photos.FirstOrDefault(t => t.Id == request.PublicId);

                if(photo == null)
                    throw new RestException(HttpStatusCode.NotFound, new {
                        Photos = "Photo doesnt exist"
                    });

                if(photo.IsMain) 
                    throw new RestException(HttpStatusCode.BadRequest, new {
                        Photos = "Main photo cannot be deleted"
                    });

                users.Photos.Remove(photo);

                if (await this._context.SaveChangesAsync() > 0)
                    return Unit.Value;

                throw new Exception("Problem occured while saving the request");

            }
        }
    }
}