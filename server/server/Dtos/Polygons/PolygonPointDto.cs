namespace server.Dtos.Polygons
{
    /// <summary>
    /// Latitude/longitude vertex provided for polygon creation.
    /// </summary>
    public sealed class PolygonPointDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
