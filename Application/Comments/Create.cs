using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public Guid ActivityId {get; set;}

            public string UserName {get; set;}

            public string Body {get; set;}
        }
        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this._mapper = mapper;
                this._context = context;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var actitivty = await this._context.Activities.FindAsync(request.ActivityId);

                if(actitivty == null)
                    throw new RestException(HttpStatusCode.NotFound, new {
                        Activity = "Activity not found"
                    });
                
                var user = await this._context.Users.SingleOrDefaultAsync(x => x.UserName == request.UserName);

                var comment = new Comment
                {
                    Id = Guid.NewGuid(),
                    Author = user,
                    Activity = actitivty,
                    Body = request.Body,
                    CreatedAt = DateTime.UtcNow
                };

                this._context.Comments.Add(comment);

                if (await this._context.SaveChangesAsync() > 0)
                    return _mapper.Map<CommentDto>(comment);

                throw new Exception("Problem occured while saving the request");
            }
        }
    }
}