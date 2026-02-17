using server.Dtos.MapData;
using server.Dtos.MapData.GeoJson;

namespace server.Handlers.MapDataHandler
{
    /// <summary>
    /// Contract for map-data aggregation and export operations.
    /// </summary>
    public interface IMapDataHandler
    {
        /// <summary>
        /// Builds table rows from saved map entities.
        /// </summary>
        Task<IReadOnlyList<MapDataRowDto>> GetRowsAsync(CancellationToken ct = default);

        /// <summary>
        /// Clears all map data and returns deletion summary counts.
        /// </summary>
        Task<ClearMapResponseDto> ClearMapDataAsync(CancellationToken ct = default);

        /// <summary>
        /// Exports all map data as a GeoJSON feature collection.
        /// </summary>
        Task<GeoJsonFeatureCollectionDto> ExportGeoJsonAsync(CancellationToken ct = default);
    }
}
