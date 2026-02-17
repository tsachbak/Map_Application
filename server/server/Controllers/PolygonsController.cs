using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Polygons;
using server.Services.PolygonsService;

namespace server.Controllers
{
    /// <summary>
    /// Exposes CRUD endpoints for map polygons.
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

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var polygons = await _polygonsService.GetAllPolygonsAsync(ct);
            return Ok(polygons);
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] SavePolygonRequestDto request, CancellationToken ct)
        {
            if (request == null)
                return BadRequest("Ilegal request");

            var id = await _polygonsService.SavePolygonAsync(request, ct);

            if (string.IsNullOrWhiteSpace(id))
                return BadRequest("Failed to save the polygon.");

            return StatusCode(201, new {id});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, CancellationToken ct)
        {
            var deleted = await _polygonsService.DeletePolygonAsync(id, ct);
         
            if (!deleted)
                return NotFound($"Polygon with ID '{id}' not found.");
            
            return NoContent();
        }
    }
}
