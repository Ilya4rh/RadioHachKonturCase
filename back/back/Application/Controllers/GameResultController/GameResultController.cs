using ClassLibrary1.Interfaces;
using Microsoft.AspNetCore.Mvc;
using WebApi.Controllers.GameResultController.Requests;
using WebApi.Controllers.GameResultController.Responses;
using WebApi.Extensions;

namespace WebApi.Controllers.GameResultController;

[Route("api/gameResults")]
public class GameResultController : ControllerBase
{
    private readonly IGameResultService _gameResultService;

    public GameResultController(IGameResultService gameResultService)
    {
        _gameResultService = gameResultService;
    }

    [HttpGet("{tournamentId:guid}")]
    [ProducesResponseType<List<GameResultResponse>>(200)]
    public async Task<IActionResult> GetResultsByTournamentId(Guid tournamentId)
    {
        var gameResults = await _gameResultService.GetResultsByTournamentId(tournamentId);

        var response = gameResults.Select(gameResult => gameResult.ToResponse()).ToList();
        
        return Ok(response);
    }

    [HttpPost("create")]
    [ProducesResponseType<Guid>(200)]
    public async Task<IActionResult> CreateGameResult([FromBody]CreateGameResultRequest request)
    {
        var id = await _gameResultService.AddGameResult(request.ToEntity());

        return Ok(id);
    }

    [HttpPut("change")]
    public async Task<IActionResult> ChangeGameResult([FromBody]ChangeGameResultRequest request)
    {
        await _gameResultService.ChangeGameResult(request.ToEntity());

        return Ok();
    }
}