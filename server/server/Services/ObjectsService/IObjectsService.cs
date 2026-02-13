using server.Dtos.Objects;

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
    }
}
