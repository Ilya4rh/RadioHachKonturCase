using ClassLibrary1;
using ClassLibrary1.Implementations;
using ClassLibrary1.Interfaces;
using Microsoft.AspNetCore.Mvc;
using WebApi.Controllers.TournamentController.Requests;
using WebApi.Controllers.TournamentController.Responses;
using WebApi.Extensions;

namespace WebApi.Controllers.TournamentController;

[Route("api/tournaments")]
public class TournamentController : ControllerBase
{
    private readonly ITournamentService _tournamentService;

    public TournamentController(ITournamentService tournamentService)
    {
        _tournamentService = tournamentService;
    }

    [HttpGet]
    [ProducesResponseType<List<TournamentResponse>>(200)]
    public async Task<IActionResult> GetTournaments()
    {
        var tournaments = await _tournamentService.GetAllAsync();
        
        return Ok(tournaments.Select(tournament => tournament.ToResponse()).ToList());
    }

    [HttpGet("tournament/{id:guid}")]
    [ProducesResponseType<TournamentResponse>(200)]
    public async Task<IActionResult> GetTournament(Guid id)
    {
        var tournament = await _tournamentService.GetByIdAsync(id);
        
        return Ok(tournament.ToResponse());
    }

    [HttpPost("tournament/create")]
    [ProducesResponseType<Guid>(200)]
    public async Task<IActionResult> CreateTournament([FromBody] CreateTournamentRequest request)
    {
        var tournament = request.ToEntity();

        var id = await _tournamentService.AddAsync(tournament);
        
        return Ok(id);
    }
    [HttpDelete("tournament/delete/{id:guid}")]
    [ProducesResponseType<Guid>(200)]
    public async Task<IActionResult> DeleteTournament(Guid id)
    {
        var result = await _tournamentService.DeleteAsync(id);
        return Ok(id);
    }
}