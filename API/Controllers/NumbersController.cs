using API.Controllers;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API;

public class NumbersController : BaseApiController
{
    private readonly DataContext _context;
    private readonly IRNGService _rngService;

    public NumbersController(DataContext context, IRNGService rngService)
    {
        _context = context;
        _rngService = rngService;
    }


    [HttpGet("lotto")]
    public async Task<ActionResult<LottoDto>> GetLotto()
    {
        return new LottoDto
        {
            Lotto6Aus49Numbers1 = await _rngService.GetRandomNumbers(1, 49, 6),
            Lotto6Aus49Numbers2 = await _rngService.GetRandomNumbers(0, 9, 1),
            EuroJackpotNumbers1 = await _rngService.GetRandomNumbers(1, 50, 5),
            EuroJackpotNumbers2 = await _rngService.GetRandomNumbers(1, 12, 2)
        };
    }

}
