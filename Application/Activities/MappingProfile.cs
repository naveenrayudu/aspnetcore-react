using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Activities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>()
                .ForMember(dst => dst.Attendees, src => src.MapFrom(t => t.UserActivities));
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(dst => dst.Username, src => src.MapFrom(t => t.AppUser.UserName))
                .ForMember(dst => dst.DisplayName, src => src.MapFrom(t => t.AppUser.DisplayName))
                .ForMember(dst => dst.Image, src => src.MapFrom(t => t.AppUser.Photos.Where(x => x.IsMain).Select(t => t.Url).FirstOrDefault()))
                .ForMember(dst => dst.IsFollowing, src => src.MapFrom<FollowingResolver>());
        }
    }
}