using System.Text.Json.Serialization;

namespace server.Dtos.Objects
{
    /// <summary>
    /// Request payload for saving multiple map objects.
    /// </summary>
    public sealed class SaveObjectsRequestDto
    {
        [JsonPropertyName("objects")]
        public List<MapObjectDto> Objects { get; set; } = new List<MapObjectDto>();
    }
}
