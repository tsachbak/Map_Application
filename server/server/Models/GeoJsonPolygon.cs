using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    /// <summary>
    /// GeoJSON Polygon structure: represents a polygon with a specific type and coordinates.
    /// </summary>
    public sealed class GeoJsonPolygon
    {
        [BsonElement("type")]
        public string Type { get; set; } = "Polygon";

        [BsonElement("coordinates")]
        public List<List<double[]>> Coordinates { get; set; } = new List<List<double[]>>();
    }
}
