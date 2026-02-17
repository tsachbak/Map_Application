using System.Text.Json.Serialization;

namespace server.Dtos.Objects
{
    /// <summary>
    /// Request payload for a single map object sent by the client.
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
        /// Object render type (for example: marker, jeep, ship, airplane).
        /// </summary>
        [JsonPropertyName("type")]
        public string Type { get; set; } = "marker";

    }
}
