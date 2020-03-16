using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilderOptions<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
           return ruleBuilder.NotEmpty()
                .MinimumLength(6).WithMessage("Password must be atleast 6 characters long")
                .Matches("[A-Z]").WithMessage("Password must contain an uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain a lowercase letter")
                .Matches("[0-9]").WithMessage("Password must contain a number")
                .Matches("[^0-9A-Za-z]").WithMessage("Password must contain non aplhanumeric character");
        }
    }
}