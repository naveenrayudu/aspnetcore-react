using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;

        private string UserName 
        {
            get
            {
                return Context.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            }
        }

        public ChatHub(IMediator mediator)
        {
            this._mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            command.UserName = this.UserName;
            var comment = this._mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }

        public async Task AddToGroup(string groupName) 
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Groups(groupName).SendAsync("Send", $"{this.UserName} has joined the group");
        }

        public async Task RemoveFromGroup(string groupName) 
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Groups(groupName).SendAsync("Send", $"{this.UserName} has left the group");
        }
    }
}