using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    public sealed class MapObjectEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Object { get; set; } = string.Empty;
        public string Type { get; set; } = "marker";

        [BsonElement("location")]
        public GeoJsonPoint Location { get; set; } = new GeoJsonPoint();
    }
}
