using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this._context = context;
                this._mapper = mapper;
            }

            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities
                    // .Include(t => t.UserActivities)
                    // .ThenInclude(t => t.AppUser)
                    .SingleOrDefaultAsync(t => t.Id == request.Id);
                
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Activity = "No activity exists"
                    });

                return this._mapper.Map<Activity, ActivityDto>(activity);
            }
        }
    }
}