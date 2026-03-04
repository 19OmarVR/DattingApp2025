using CloudinaryDotNet.Actions;

namespace API.Interfaces;

public interface IPhotoService
{
    Task<ImageUploadResult> UploadPhotoAsyng(IFormFile formFile);
    Task<DeletionResult> DeletePhotoAsync(string publicId);
}