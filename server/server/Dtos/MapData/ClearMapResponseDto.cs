namespace server.Dtos.MapData
{
    /// <summary>
    /// Response payload for the clear-all map-data operation.
    /// </summary>
    public sealed class ClearMapResponseDto
    {
        public long DeletedObjectsCount { get; init; }
        public long DeletedPolygonsCount { get; init; }
    }
}
