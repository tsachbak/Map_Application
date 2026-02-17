using server.Dtos.Objects;
using server.Models;

namespace server.Services.ObjectsService
{
    /// <summary>
    /// Contract for map-object persistence operations.
    /// </summary>
    public interface IObjectsService
    {
        /// <summary>
        /// Saves objects and returns the number of inserted records.
        /// </summary>
        Task<int> SaveObjectsAsync(SaveObjectsRequestDto request, CancellationToken ct = default);

        /// <summary>
        /// Returns all saved map objects.
        /// </summary>
        Task<IReadOnlyList<MapObjectEntity>> GetAllObjectsAsync(CancellationToken ct = default);

        /// <summary>
        /// Deletes one object by ID.
        /// </summary>
        Task<bool> DeleteObjectAsync(string id, CancellationToken ct = default);

        /// <summary>
        /// Deletes all objects and returns the deleted count.
        /// </summary>
        Task<long> DeleteAllObjectsAsync(CancellationToken ct = default);
    }
}
