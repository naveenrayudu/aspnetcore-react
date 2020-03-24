using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<IEnumerable<ActivityDto>> { }

        public class Handler : IRequestHandler<Query, IEnumerable<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this._context = context;
                this._mapper = mapper;
            }

            public async Task<IEnumerable<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await this._context.Activities
                    .Include(t => t.UserActivities)
                    .ThenInclude(t => t.AppUser)
                    .ToListAsync();
                
                return this._mapper.Map<List<Activity>, List<ActivityDto>>(activities);
            }
        }
    }
}