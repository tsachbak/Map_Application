namespace server.Dtos.Polygons
{
    /// <summary>
    /// Request payload for saving a polygon.
    /// </summary>
    public sealed class SavePolygonRequestDto
    {
        public string? Name { get; set; }
        public List<PolygonPointDto> Points { get; set; } = new List<PolygonPointDto>();
    }
}
