using server.Dtos.Polygons;
using server.Models;

namespace server.Services.PolygonsService
{
    /// <summary>
    /// Contract for polygon persistence operations.
    /// </summary>
    public interface IPolygonsService
    {
        /// <summary>
        /// Saves a polygon and returns its ID.
        /// </summary>
        Task<string?> SavePolygonAsync(SavePolygonRequestDto request, CancellationToken ct = default);

        /// <summary>
        /// Returns all saved polygons.
        /// </summary>
        Task<IReadOnlyList<MapPolygonEntity>> GetAllPolygonsAsync(CancellationToken ct = default);

        /// <summary>
        /// Deletes one polygon by ID.
        /// </summary>
        Task<bool> DeletePolygonAsync(string id, CancellationToken ct = default);

        /// <summary>
        /// Deletes all polygons and returns the deleted count.
        /// </summary>
        Task<long> DeleteAllPolygonsAsync(CancellationToken ct = default);
    }
}
