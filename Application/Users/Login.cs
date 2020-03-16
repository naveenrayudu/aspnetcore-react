using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.Users
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator: AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IJWTGenerator JWTGenerator;

            public Handler(UserManager<AppUser> userManager, IJWTGenerator jWTGenerator)
            {
                this.userManager = userManager;
                JWTGenerator = jWTGenerator;
            }

           

            public async Task<User> Handle(Query query, CancellationToken cancellationToken)
            {
               var user = await userManager.FindByEmailAsync(query.Email);
               if(user == null)
                    throw new RestException(HttpStatusCode.Unauthorized);

               if(await userManager.CheckPasswordAsync(user, query.Password))
               {
                   return new User()
                   {
                       DisplayName = user.DisplayName,
                       UserName = user.UserName,
                       Token = JWTGenerator.CreateToken(user)
                   };
               }

                throw new RestException(HttpStatusCode.Unauthorized);
            }
        }
    }
}