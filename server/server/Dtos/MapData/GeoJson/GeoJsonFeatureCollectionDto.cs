namespace server.Dtos.MapData.GeoJson
{
    /// <summary>
    /// GeoJSON FeatureCollection containing multiple features.
    /// </summary>
    public sealed class GeoJsonFeatureCollectionDto
    {
        public string Type { get; init; } = "FeatureCollection";
        public List<GeoJsonFeatureDto> Features { get; init; } = new();
    }
}
