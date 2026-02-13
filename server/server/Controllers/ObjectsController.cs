using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Dtos.Objects;

namespace server.Controllers
{
    /// <summary>
    /// ObjectsController handles API requests related to Map Objects.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ObjectsController : ControllerBase
    {
        [HttpPost("save")]
        public IActionResult Save([FromBody] SaveObjectsRequestDto request)
        {
            var response = new SaveObjectsResponseDto
            {
                Count = request.Objects.Count,
                Objects = request.Objects
            };

            return Ok(response);
        }
    }
}
