using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessagesRepository
{
   void Add(Message message);
   void Delete(Message message);
   Task<Message?> Get(string messageId);
   Task<PaginationResult<MessageResponse>> GetForMember(MessageParams messageRequest);
   Task<IReadOnlyList<MessageResponse>> GetThreadAsync(string currentMemberId, string recipientId);
   Task<Group?> GetMessageGroupAsync(string groupName);
   void AddGroup(Group group);
   Task RemoveConnectionAsync(string connectionId);
   Task<bool> SaveAllAsync();
}
