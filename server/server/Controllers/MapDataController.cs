using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Handlers.MapDataHandler;

namespace server.Controllers
{
    /// <summary>
    /// MapDataController handles API requests related to Map Data.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MapDataController : ControllerBase
    {
        private readonly IMapDataHandler _mapDataHandler;

        public MapDataController(IMapDataHandler mapDataHandler)
        {
            _mapDataHandler = mapDataHandler;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var rows = await _mapDataHandler.GetRowsAsync(ct);
            return Ok(rows);
        }

        [HttpDelete("clear-all")]
        public async Task<IActionResult> ClearAll(CancellationToken ct)
        {
            var result = await _mapDataHandler.ClearMapDataAsync(ct);

            return Ok(result);
        }
    }
}
