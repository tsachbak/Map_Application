namespace server.Dtos.MapData
{
    /// <summary>
    /// Response DTO for clearing all map data.
    /// </summary>
    public sealed class ClearMapResponseDto
    {
        public long DeletedObjectsCount { get; init; }
        public long DeletedPolygonsCount { get; init; }
    }
}
