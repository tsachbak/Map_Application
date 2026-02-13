using server.Dtos.Objects;
using server.Models;

namespace server.Services.ObjectsService
{
    /// <summary>
    /// Defines the contract for the ObjectsService, which handles business logic related to Map Objects.
    /// </summary>
    public interface IObjectsService
    {
        /// <summary>
        /// Saves a list of Map Objects to the database and returns the count of saved objects.
        /// </summary>
        Task<int> SaveObjectsAsync(SaveObjectsRequestDto request, CancellationToken ct = default);

        /// <summary>
        /// Gets all Map Objects from the database.
        /// </summary>
        Task<IReadOnlyList<MapObjectEntity>> GetAllObjectsAsync(CancellationToken ct = default);

        /// <summary>
        /// Deletes a single Map Object by its MongoDB _id and returns true if the deletion was successful, false otherwise.
        /// </summary>
        Task<bool> DeleteObjectAsync(string id, CancellationToken ct = default);
    }
}
