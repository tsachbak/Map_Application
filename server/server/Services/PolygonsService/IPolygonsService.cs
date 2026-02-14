using server.Dtos.Polygons;
using server.Models;

namespace server.Services.PolygonsService
{
    /// <summary>
    /// Defines the contract for the PolygonsService, which handles business logic related to Polygons.
    /// </summary>
    public interface IPolygonsService
    {
        /// <summary>
        /// Saves a polygon to the database and returns its ID.
        /// </summary>
        Task<string?> SavePolygonAsync(SavePolygonRequestDto request, CancellationToken ct = default);

        /// <summary>
        /// Get all polygons from the database and return them as a list of MapPolygonEntity objects.
        /// </summary>
        Task<IReadOnlyList<MapPolygonEntity>> GetAllPolygonsAsync(CancellationToken ct = default);
    }
}
