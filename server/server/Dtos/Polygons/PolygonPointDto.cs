namespace server.Dtos.Polygons
{
    /// <summary>
    /// Represents a single point (vertex) of a polygon received from the client.
    /// </summary>
    public sealed class PolygonPointDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
