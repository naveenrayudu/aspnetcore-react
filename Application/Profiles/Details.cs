using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Profile> 
        { 
            public string UserName {get; set;}
        }
        
        public class Handler : IRequestHandler<Query, Profile>
        {
             private readonly DataContext _context;
             public Handler(DataContext context)
             {
                  this._context = context;
             }
        
             public async Task<Profile> Handle(Query query, CancellationToken cancellationToken)
             {
                  var user = await this._context.Users.FirstOrDefaultAsync(t => t.UserName == query.UserName);

                  return new Profile
                  {
                      UserName = user.UserName,
                      DisplayName = user.DisplayName,
                      Bio = user.Bio,
                      Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                      Photos = user.Photos
                  };
             }
        }
    }
}