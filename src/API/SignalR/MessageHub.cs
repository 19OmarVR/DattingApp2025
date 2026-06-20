using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using API.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class MessageHub(IMessagesRepository messagesRepository,
    IMembersRepository membersRepository) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext?.Request.Query["userId"].ToString() ?? throw new HubException("Other user not found");
        var groupName = GetGroupName(GetUserId(), otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var messages = await messagesRepository.GetThread(GetUserId(), otherUser);
        await Clients.Group(groupName).SendAsync("ReceivedMessageThread", messages);
    }

    public async Task SendMessage(MessageRequest request)
    {
        var sender = await membersRepository.GetMemberAsync(GetUserId());
        var recipient = await membersRepository.GetMemberAsync(request.RecipientId);

        if (recipient == null || sender == null || sender.Id == request.RecipientId)
        {
            throw new HubException("Unable to send the message");
        }

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = request.Content
        };

        messagesRepository.Add(message);

        if (await messagesRepository.SaveAllAsync())
        {
            var group = GetGroupName(sender.Id, recipient.Id);
            await Clients.Group(group).SendAsync("NewMessage", message.ToResponse());
        }
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    private static string GetGroupName(string? caller, string? other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }

    private string GetUserId()
    {
        return Context.User?.FindFirstValue(ClaimTypes.Email) ?? throw new HubException("Cannot get member id");
    }
}