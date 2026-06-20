using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Mappers;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessagesRepository(AppDbContext context) : IMessagesRepository
{
    public void Add(Message message) => context.Messages.Add(message);

    public void Delete(Message message) => context.Messages.Remove(message);

    public async Task<Message?> Get(string messageId) => await context.Messages.FindAsync(messageId);

    public async Task<PaginationResult<MessageResponse>> GetForMember(MessageParams messageParams)
    {
        var query = context.Messages
            .OrderByDescending(m => m.MessageSent)
            .AsQueryable();

        query = messageParams.Container switch
        {
            ContainerTypes.Outbox => query.Where(m => m.SenderId == messageParams.MemberId),
            _ => query.Where(m => m.RecipientId == messageParams.MemberId)
        };

        var messageQuery = query.Select(MessageMapper.ToResponseProjection());

        return await Pagination.CreateAsync(messageQuery, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageResponse>> GetThreadAsync(string currentMemberId, string recipientId)
    {
        await context.Messages
            .Where(m => m.RecipientId == currentMemberId
                && m.SenderId == recipientId
                && m.DateRead == null)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(m => m.DateRead, DateTime.UtcNow));

        return await context.Messages
            .Where(m => (m.RecipientId == currentMemberId && m.SenderId == recipientId)
                || (m.RecipientId == recipientId && m.SenderId == currentMemberId))
            .OrderBy(m => m.MessageSent)
            .Select(MessageMapper.ToResponseProjection())
            .ToListAsync();
    }

    public async Task<Group?> GetMessageGroupAsync(string groupName)
    {
        return await context.Groups
            .Include(g => g.Connections)
            .FirstOrDefaultAsync(g => g.Name == groupName);
    }

    public void AddGroup(Group group) => context.Groups.Add(group);

    public async Task RemoveConnectionAsync(string connectionId)
    {
        var connection = await context.Connections.FindAsync(connectionId);
        if (connection != null) context.Connections.Remove(connection);
    }

    public async Task<bool> SaveAllAsync() => await context.SaveChangesAsync() > 0;
}
