using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Handlers.MapDataHandler;
using server.Utils;

namespace server.Controllers
{
    /// <summary>
    /// Exposes map-data endpoints (rows, clear-all, GeoJSON export).
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

        [HttpGet("export-geojson")]
        public async Task<IActionResult> ExportGeoJson(CancellationToken ct)
        {
            var featureCollection = await _mapDataHandler.ExportGeoJsonAsync(ct);
            var bytes = GeoJsonFileSerializer.SerializeToUtf8Bytes(featureCollection);

            return File(bytes, "application/geo+json", "map_data.geojson");
        }
    }
}
