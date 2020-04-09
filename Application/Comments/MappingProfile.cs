using System.Linq;
using AutoMapper;
using Domain;

namespace Application.Comments
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Comment, CommentDto>()
                .ForMember(dst => dst.DisplayName, o => o.MapFrom(x => x.Author.DisplayName))
                .ForMember(dst => dst.UserName, o => o.MapFrom(x => x.Author.UserName))
                .ForMember(dst => dst.Image, o => o.MapFrom(x => x.Author.Photos.FirstOrDefault(x => x.IsMain)!.Url));
        }
    }
}