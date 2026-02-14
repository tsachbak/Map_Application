using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    /// <summary>
    /// Represents a map polygon entity with an ID, name, and location.
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
