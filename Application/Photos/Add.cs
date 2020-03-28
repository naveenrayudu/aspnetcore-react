using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Photo>
        {
            public IFormFile File {get; set;}
        }
        public class Handler : IRequestHandler<Command, Photo>
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

            public async Task<Photo> Handle(Command request, CancellationToken cancellationToken)
            {
                var uploadedFileResult = await this._photoAccessor.AddPhoto(request.File);
                var user = await this._context.Users.SingleOrDefaultAsync(t => t.UserName == this._userAccessor.GetCurrentUserName());

                var photo = new Photo
                {
                    Url = uploadedFileResult.Url,
                    Id = uploadedFileResult.PublicId
                };

                if(!user.Photos.Any(t => t.IsMain)) {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);
                if (await this._context.SaveChangesAsync() > 0)
                    return photo;

                throw new Exception("Problem occured while saving the request");

            }
        }
    }
}