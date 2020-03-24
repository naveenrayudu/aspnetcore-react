using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public string Category { get; set; }

            public string City { get; set; }

            public string Venue { get; set; }

            public DateTime? Date { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            { 
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
                RuleFor(x => x.Venue).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
            }
        }
        
        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities.FindAsync(request.Id);
                
                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new
                    {
                        Activity = "No activity exists"
                    });
                

                activity.Category = request.Category ?? activity.Category;
                activity.City = request.City ?? activity.City;
                activity.Date = request.Date ?? activity.Date;
                activity.Description = request.Description ?? activity.Description;
                activity.Title = request.Title ?? activity.Title;
                activity.Venue = request.Venue ?? activity.Venue;


                if (await this._context.SaveChangesAsync() > 0)
                    return Unit.Value;

                throw new Exception("Problem occured while saving the request");

            }
        }
    }
}