using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class CurrentUser
    {
        public class Query : IRequest<User> { }
        
        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> usermanager;
            private readonly IJWTGenerator jWTGenerator;
            private readonly IUserAccessor userAccessor;

            public Handler(UserManager<AppUser> usermanager, IJWTGenerator jWTGenerator, IUserAccessor userAccessor )
            {
                this.usermanager = usermanager;
                this.jWTGenerator = jWTGenerator;
                this.userAccessor = userAccessor;
            }
        
             public async Task<User> Handle(Query query, CancellationToken cancellationToken)
             {
                   var user = await this.usermanager.FindByNameAsync(this.userAccessor.GetCurrentUserName());

                   return new User() 
                   {
                       DisplayName = user.DisplayName,
                       UserName = user.UserName,
                       Token = this.jWTGenerator.CreateToken(user),
                       Image = null
                   };
             }
        }
    }
}