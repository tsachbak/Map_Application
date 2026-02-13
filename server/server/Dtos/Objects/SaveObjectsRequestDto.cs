using System.Text.Json.Serialization;

namespace server.Dtos.Objects
{
    /// <summary>
    /// Request DTO for saving map objects.
    /// Contains a list of MapObjectDto.
    /// </summary>
    public sealed class SaveObjectsRequestDto
    {
        [JsonPropertyName("objects")]
        public List<MapObjectDto> Objects { get; set; } = new List<MapObjectDto>();
    }
}
