using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsDummyRequirement: IAuthorizationRequirement
    {

    }

     public class IsDummyRequirementHandler : AuthorizationHandler<IsDummyRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;

        public IsDummyRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext dataContext, IUserAccessor userAccessor)
        {
            this._httpContextAccessor = httpContextAccessor;
            this._dataContext = dataContext;
            this._userAccessor = userAccessor;

        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsDummyRequirement requirement)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }
    }
}