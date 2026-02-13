namespace server.Settings
{
    /// <summary>
    /// MongoSettings represents the configuration settings required to connect to a MongoDB database.
    /// </summary>
    public sealed class MongoSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}
