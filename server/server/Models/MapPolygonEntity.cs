using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    /// <summary>
    /// Persisted polygon entity with name and GeoJSON location.
    /// </summary>
    public sealed class MapPolygonEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Name { get; set; } = "polygon";

        [BsonElement("location")]
        public GeoJsonPolygon Location { get; set; } = new GeoJsonPolygon();
    }
}
