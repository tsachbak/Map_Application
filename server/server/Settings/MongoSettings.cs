namespace server.Settings
{
    /// <summary>
    /// MongoDB connection and database configuration.
    /// </summary>
    public sealed class MongoSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}
