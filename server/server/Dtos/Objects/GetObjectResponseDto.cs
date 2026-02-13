namespace server.Dtos.Objects
{
    /// <summary>
    /// Response DTO for a single Map Object returned from the API.
    /// </summary>
    public sealed class GetObjectResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Object { get; set; } = string.Empty;
        public string Type { get; set; } = "marker";
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
