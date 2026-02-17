namespace server.Dtos.MapData.GeoJson
{
    /// <summary>
    /// GeoJSON Feature with geometry and metadata properties.
    /// </summary>
    public sealed class GeoJsonFeatureDto
    {
        public string Type { get; init; } = "Feature";
        public object Geometry { get; init; } = new();
        public Dictionary<string, object> Properties { get; init; } = new();
    }
}
