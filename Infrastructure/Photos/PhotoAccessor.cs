using System.Threading.Tasks;
using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _Cloudinary;
        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _Cloudinary = new Cloudinary(acc);
        }

        public async Task<PhotoUploadedResult> AddPhoto(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();

            if(file.Length > 0) 
            {
                using(var reader = file.OpenReadStream()) 
                {
                    var uploadParams = new ImageUploadParams() 
                    {
                        File = new FileDescription(file.Name, reader),
                        Transformation = new Transformation()
                                                        .Height(500)
                                                        .Width(500)
                                                        .Crop("fill")
                                                        .Gravity("face")
                    };

                   uploadResult = await _Cloudinary.UploadAsync(uploadParams);
                }
            }

            if(uploadResult.Error != null)
            {
                throw new System.Exception(uploadResult.Error.Message);
            }

            return new PhotoUploadedResult()
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUri.AbsoluteUri
            };
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await this._Cloudinary.DestroyAsync(deleteParams);

            return result.Result == "ok" ? result.Result : null;
        }
    }
}