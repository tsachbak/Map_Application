using System.Text.Json.Serialization;

namespace server.Dtos.Objects
{
    /// <summary>
    /// Response DTO for saving map objects.
    /// </summary>
    public sealed class SaveObjectsResponseDto
    {
        [JsonPropertyName("count")]
        public int Count { get; set; }

        [JsonPropertyName("objects")]
        public List<MapObjectDto> Objects { get; set; } = new List<MapObjectDto>();
    }
}
