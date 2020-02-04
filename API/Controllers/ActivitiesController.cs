using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator)
        {
            this._mediator = mediator;
        }

        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<Activity>>> List()
        {
            return this.Ok(await this._mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Get(Guid id)
        {
            return await this._mediator.Send(new Details.Query() { Id = id });
        }

        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command command)
        {
            return await this._mediator.Send(command);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> Update(Guid id, Edit.Command command)
        {
            command.Id = id;
            return await this._mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid id)
        {
            return await this._mediator.Send(new Delete.Command() { Id = id });
        }
    }
}