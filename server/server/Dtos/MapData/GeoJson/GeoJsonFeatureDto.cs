namespace server.Dtos.MapData.GeoJson
{
    /// <summary>
    /// Represents a GeoJSON Feature object, containing geometry and associated properties, as defined by the GeoJSON
    /// specification.
    /// </summary>
    public sealed class GeoJsonFeatureDto
    {
        public string Type { get; init; } = "Feature";
        public object Geometry { get; init; } = new();
        public Dictionary<string, object> Properties { get; init; } = new();
    }
}
