namespace WebApi.Controllers.AuthenticationController.Requests;

public record AuthenticationRequest
{
    public string Name { get; init; }
    
    public string Password { get; init; }
}