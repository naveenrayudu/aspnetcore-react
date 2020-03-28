using System.Threading;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController: BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Get(string username, CancellationToken cancellationToken) 
        {
            return await this.Mediator.Send(new Details.Query(){UserName = username}, cancellationToken);
        }
    }
}