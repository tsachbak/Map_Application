namespace server.Models
{
    /// <summary>
    /// GeoJSON Point structure representing a geographic point with a specific type and coordinates.
    /// </summary>
    public sealed class GeoJsonPoint
    {
        public string Type { get; set; } = "Point";
        public double[] Coordinates { get; set; } = new double[2];
    }
}
