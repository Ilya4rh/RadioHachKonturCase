using ClassLibrary1.Enums;
using ClassLibrary1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Controllers.AuthenticationController.Requests;
using WebApi.Controllers.AuthenticationController.Responses;

namespace WebApi.Controllers.AuthenticationController;

[Route("api/authentication")]
public class AuthenticationController : ControllerBase
{
    private readonly IOptions<Admin> _admin;

    public AuthenticationController(IOptions<Admin> admin)
    {
        _admin = admin;
    }

    [HttpPost("authenticate")]
    [ProducesResponseType<AuthenticationResponse>(200)]
    public IActionResult Authenticate([FromBody] AuthenticationRequest request)
    {
        if (_admin.Value.Name != request.Name)
        {
            return Ok(new AuthenticationResponse { AuthenticationResult = AuthenticationResult.UserNotFound });
        }

        if (_admin.Value.Password != request.Password)
        {
            return Ok(new AuthenticationResponse { AuthenticationResult = AuthenticationResult.WrongPassword });
        }

        return Ok(new AuthenticationResponse { AuthenticationResult = AuthenticationResult.Success });
    }
}