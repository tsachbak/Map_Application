using System.Text.Json.Serialization;

namespace server.Dtos.Objects
{
    /// <summary>
    /// Represents a single map object (marker/symbol) recieved from the client.
    /// </summary>
    public sealed class MapObjectDto
    {
        [JsonPropertyName("object")]
        public string Object { get; set; } = string.Empty;

        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        /// <summary>
        /// Expected values: "marker" or "symbol".
        /// Determines how the object should be rendered on the map.
        /// </summary>
        [JsonPropertyName("type")]
        public string Type { get; set; } = "marker";

    }
}
