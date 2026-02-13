using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    /// <summary>
    /// GeoJSON Point structure representing a geographic point with a specific type and coordinates.
    /// </summary>
    public sealed class GeoJsonPoint
    {
        [BsonElement("type")]
        public string Type { get; set; } = "Point";

        [BsonElement("coordinates")]
        public double[] Coordinates { get; set; } = new double[2];
    }
}
