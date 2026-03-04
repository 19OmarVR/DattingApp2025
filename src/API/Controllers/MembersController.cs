using System.Security.Claims;
using API.DTOs;
using API.Data;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Mappers;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMembersRepository membersRepository, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
        {
            return Ok(await membersRepository.GetMembersAsync());
        }

        [HttpGet("{id}")] //localhost:5001/api/members/omar_id
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await membersRepository.GetMemberAsync(id);
            if (member == null) return NotFound();
            return member.ToResponse();
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotos(string id)
        {
            return Ok(await membersRepository.GetPhotosAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateRequest request)
        {
            var memberId = User.GetMemberId();
            var member = await membersRepository.GetMemberForUpdateAsync(memberId);
            if (member == null)
            {
                return BadRequest("Failed to get member");
            }

            member.DisplayName = request.DisplayName ?? member.DisplayName;
            member.Description = request.Description ?? member.Description;
            member.City = request.City ?? member.City;
            member.Country = request.Country ?? member.Country;
            member.User.DisplayName = request.DisplayName ?? member.User.DisplayName;

            membersRepository.Update(member);

            if (await membersRepository.SaveAllAsync())
            {
                return NoContent();
            }

            return BadRequest("Failed to update profile");
        }
        [HttpPost("photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await membersRepository.GetMemberForUpdateAsync(User.GetMemberId());

            if (member == null)
            {
                return NotFound("Member not found");
            }

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if (await membersRepository.SaveAllAsync())
            {
                return photo;
            }

            return BadRequest("Somehting went wrong!");
        }
    }
}
