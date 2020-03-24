using System;
using System.Linq;
using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _dataContext;
        private readonly IUserAccessor _userAccessor;

        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext dataContext, IUserAccessor userAccessor)
        {
            this._httpContextAccessor = httpContextAccessor;
            this._dataContext = dataContext;
            this._userAccessor = userAccessor;

        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var user = this._dataContext.Users.SingleOrDefault(t => t.UserName == this._userAccessor.GetCurrentUserName());
            var activityId = Guid.Parse(this._httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(t => t.Key == "id").Value.ToString());

            bool isHost = this._dataContext.UserActivities.Any(t => t.AppUserId == user.Id &&
                                                                                 t.ActivityId == activityId && t.IsHost);


            if (isHost)
            {
                context.Succeed(requirement);
            }


            return Task.CompletedTask;
            
        }
    }
}