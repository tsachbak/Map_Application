using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Polygons;
using server.Services.PolygonsService;

namespace server.Controllers
{
    /// <summary>
    /// PolygonsController handles API requests related to Map Polygons.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class PolygonsController : ControllerBase
    {
        private readonly IPolygonsService _polygonsService;

        public PolygonsController(IPolygonsService polygonsService)
        {
            _polygonsService = polygonsService;
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] SavePolygonRequestDto request, CancellationToken ct)
        {
            if (request?.Points == null || request.Points.Count < 3)
                return BadRequest("A polygon must have at least 3 points.");

            var id = await _polygonsService.SavePolygonAsync(request, ct);

            if (string.IsNullOrWhiteSpace(id))
                return BadRequest("Failed to save the polygon.");

            return StatusCode(201, new {id});
        }
    }
}
