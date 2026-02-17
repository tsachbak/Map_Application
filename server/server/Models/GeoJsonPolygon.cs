using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    /// <summary>
    /// GeoJSON Polygon model with one or more coordinate rings.
    /// </summary>
    public sealed class GeoJsonPolygon
    {
        [BsonElement("type")]
        public string Type { get; set; } = "Polygon";

        [BsonElement("coordinates")]
        public List<List<double[]>> Coordinates { get; set; } = new List<List<double[]>>();
    }
}
