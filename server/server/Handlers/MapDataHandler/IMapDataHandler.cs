using server.Dtos.MapData;

namespace server.Handlers.MapDataHandler
{
    /// <summary>
    /// Handler interface for Map Data, which provides a unified way to retrieve all map data points.
    /// </summary>
    public interface IMapDataHandler
    {
        /// <summary>
        /// Builds table rows for map data points.
        /// </summary>
        Task<IReadOnlyList<MapDataRowDto>> GetRowsAsync(CancellationToken ct = default);

        /// <summary>
        /// Clears all map data (Objects and Polygons) from the database and returns a summary of the deleted data.
        /// </summary>
        Task<ClearMapResponseDto> ClearMapDataAsync(CancellationToken ct = default);
    }
}
