using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")] //localhost:5001/api/members
    [ApiController]
    public class MembersController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public ActionResult<IReadOnlyList<AppUser>> GetMembers()
        {
            var members = context.Users.ToList();
            return members;
        }

        [HttpGet("{id}")] //localhost:5001/api/members/omar_id
        public ActionResult<AppUser> GetMember(string id)
        {
            var member = context.Users.Find(id);
            if (member == null) return NotFound(member);
            return member;
        }
    }
}
