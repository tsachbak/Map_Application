namespace server.Dtos.MapData
{
    /// <summary>
    /// Represents a row of single map data point (could be Object or Polygon vertex)
    /// </summary>
    public sealed class MapDataRowDto
    {
        /// <summary>
        /// RowType can be "Object" or "PolygonVertex"
        /// </summary>
        public string RowType { get; set; } = string.Empty;
        /// <summary>
        /// Latitude
        /// </summary>
        public double Latitude { get; set; }
        /// <summary>
        /// Longitude
        /// </summary>
        public double Longitude { get; set; }
        /// <summary>
        /// The Id of the source entity:
        /// - For Objects: the ObjectId
        /// - For Polygon Vertices: PolygonId only
        /// </summary>
        public string SourceId { get; set; } = string.Empty;
        /// <summary>
        /// Grouping Id to group vertices of the same polygon together, only applicable for PolygonVertex RowType
        /// </summary>
        public string? GroupId { get; set; }
        /// <summary>
        /// Vertex index within the polygon ring (only for polygonVertex)
        /// </summary>
        public int? VertexIndex { get; set; }
    }
}
