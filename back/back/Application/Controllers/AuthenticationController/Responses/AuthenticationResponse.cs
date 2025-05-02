using ClassLibrary1.Enums;
using Microsoft.AspNetCore.Authentication;

namespace WebApi.Controllers.AuthenticationController.Responses;

public record AuthenticationResponse
{
    public AuthenticationResult AuthenticationResult { get; init; }
}