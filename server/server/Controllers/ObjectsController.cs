using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Objects;
using server.Services.ObjectsService;

namespace server.Controllers
{
    /// <summary>
    /// ObjectsController handles API requests related to Map Objects.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ObjectsController : ControllerBase
    {
        private readonly IObjectsService _objectsService;

        public ObjectsController(IObjectsService objectsService)
        {
            _objectsService = objectsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
        {
            var objects = await _objectsService.GetAllObjectsAsync(ct);

            var dtos = objects.Select(o => new GetObjectResponseDto
            {
                Id = o.Id,
                Object = o.Object,
                Type = o.Type,
                Latitude = o.Location.Coordinates[1],
                Longitude = o.Location.Coordinates[0]
            }).ToList();

            return Ok(dtos);
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save([FromBody] SaveObjectsRequestDto request, CancellationToken ct)
        {
            var savedCount = await _objectsService.SaveObjectsAsync(request, ct);

            if (savedCount == 0)
                return BadRequest("No objects to save.");

            return Ok(new SaveObjectsResponseDto
            {
                Count = savedCount,
                Objects = request.Objects
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, CancellationToken ct)
        {
            var deleted = await _objectsService.DeleteObjectAsync(id, ct);

            if (!deleted)
                return NotFound($"Object with ID '{id}' not found.");

            return NoContent();
        }
    }
}
