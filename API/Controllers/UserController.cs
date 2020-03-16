using System.Threading;
using System.Threading.Tasks;
using Application.Users;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class UserController: BaseController
    {
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Login(Login.Query query, CancellationToken cancellationToken)
        {
            return await this.Mediator.Send(query, cancellationToken);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> Register(Register.Command command, CancellationToken cancellationToken)
        {
            return await this.Mediator.Send(command, cancellationToken);
        }

        [HttpGet]
        public async Task<ActionResult<User>> CurrentUser(CancellationToken cancellationToken)
        {
            return await this.Mediator.Send(new CurrentUser.Query(), cancellationToken);
        }

    }
}