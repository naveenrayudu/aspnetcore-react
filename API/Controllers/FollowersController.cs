using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Followers;
using Application.Profiles;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        private readonly IMediator _mediator;
        public FollowersController(IMediator mediator)
        {
            this._mediator = mediator;

        }

        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username, CancellationToken cancellationToken)
        {
            return await this._mediator.Send(new Add.Command() {UserName = username}, cancellationToken);
        }

        [HttpDelete("{username}/follow")]
        public async Task<ActionResult<Unit>> Unfollow(string username, CancellationToken cancellationToken)
        {
            return await this._mediator.Send(new Delete.Command() {UserName = username}, cancellationToken);
        }

        [HttpGet("{username}/follow")]
        public async Task<ActionResult<IEnumerable<Profile>>> List(string username, string predicate, CancellationToken cancellationToken)
        {
            return (await this._mediator.Send(new List.Query() {UserName = username, Predicate = predicate}, cancellationToken)).ToList();
        }
    }
}