using System.Threading;
using System.Threading.Tasks;
using Application.Photos;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController: BaseController
    {
        [HttpPost]
        public async Task<ActionResult<Photo>> Add([FromForm]Add.Command command, CancellationToken cancellationToken)
        {
            return await this.Mediator.Send(command, cancellationToken);
        }
        
        [HttpDelete("{publicId}")]
        public async Task<ActionResult<Unit>> Delete(string publicId, CancellationToken cancellationToken)
        {
            return await this.Mediator.Send(new Delete.Command(){PublicId = publicId}, cancellationToken);
        }

        [HttpPost("{id}/setmain")]
        public async Task<ActionResult<Unit>> SetMain(string id, CancellationToken cancellationToken)
        {
             return await this.Mediator.Send(new SetMain.Command(){Id = id}, cancellationToken);
        }


    }
}