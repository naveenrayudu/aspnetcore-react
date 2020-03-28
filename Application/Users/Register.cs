using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string UserName { get; set; }
            public string DisplayName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            public UserManager<AppUser> UserManager { get; }
            public IJWTGenerator JWTGenerator { get; }
            public DataContext DataContext { get; }
            public Handler(DataContext dataContext, UserManager<AppUser> userManager, IJWTGenerator jWTGenerator)
            {
                this.DataContext = dataContext;
                this.JWTGenerator = jWTGenerator;
                this.UserManager = userManager;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await this.DataContext.Users.AnyAsync(x => x.Email == request.Email))
                {
                    throw new RestException(HttpStatusCode.BadRequest, "Email already exists");
                }

                if (await this.DataContext.Users.AnyAsync(x => x.UserName == request.UserName))
                {
                    throw new RestException(HttpStatusCode.BadRequest, "Username already exists");
                }


                var appUser = new AppUser()
                {
                    Email = request.Email,
                    DisplayName = request.DisplayName,
                    UserName = request.UserName
                };
                var result = await this.UserManager.CreateAsync(appUser, request.Password);

                if (result.Succeeded)
                {
                    return new User()
                    {
                        DisplayName = appUser.DisplayName,
                        Token = this.JWTGenerator.CreateToken(appUser),
                        UserName = appUser.UserName,
                        Image = null
                    };
                }

                throw new RestException(HttpStatusCode.BadRequest, result.Errors);

            }
        }
    }
}