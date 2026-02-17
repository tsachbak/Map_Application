namespace server.Dtos.MapData
{
    /// <summary>
    /// Flattened map-data row (object point or polygon vertex).
    /// </summary>
    public sealed class MapDataRowDto
    {
        /// <summary>
        /// "Object" or "PolygonVertex".
        /// </summary>
        public string RowType { get; set; } = string.Empty;

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        /// <summary>
        /// Source entity ID (object ID or polygon ID).
        /// </summary>
        public string SourceId { get; set; } = string.Empty;

        /// <summary>
        /// Polygon grouping ID, used only for "PolygonVertex" rows.
        /// </summary>
        public string? GroupId { get; set; }

        /// <summary>
        /// Vertex index within the polygon ring (only for "PolygonVertex").
        /// </summary>
        public int? VertexIndex { get; set; }
    }
}
