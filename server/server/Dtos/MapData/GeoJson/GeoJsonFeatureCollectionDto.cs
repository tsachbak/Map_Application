namespace server.Dtos.MapData.GeoJson
{
    /// <summary>
    /// GeoJSON FeatureCollection DTO, which represents a collection of GeoJSON features.
    /// </summary>
    public sealed class GeoJsonFeatureCollectionDto
    {
        public string Type { get; init; } = "FeatureCollection";
        public List<GeoJsonFeatureDto> Features { get; init; } = new();
    }
}
