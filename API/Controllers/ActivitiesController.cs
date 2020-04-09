using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<ActivityDto>>> List()
        {
            return this.Ok(await this.Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ActivityDto>> Get(Guid id)
        {
            return await this.Mediator.Send(new Details.Query() { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Application.Activities.Create.Command command)
        {
            return await this.Mediator.Send(command);
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Update(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await this.Mediator.Send(command);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await this.Mediator.Send(new Delete.Command() { Id = id });
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await this.Mediator.Send(new Attend.Command(){ Id = id });
        }

        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> UnAttend(Guid id) 
        {
            return await this.Mediator.Send(new Unattend.Command(){ Id = id });
        }

        [HttpPost("postcomment")]
        public async Task<ActionResult<CommentDto>> PostComment(Application.Comments.Create.Command command)
        {
            return await this.Mediator.Send(command);
        }
    }
}