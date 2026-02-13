using Microsoft.Extensions.Options;
using MongoDB.Driver;
using server.Models;
using server.Settings;

namespace server.Services
{
    /// <summary>
    /// Mongo DB Service.
    /// </summary>
    public sealed class MongoDbService
    {
        private readonly IMongoDatabase _database;
        public IMongoCollection<MapObjectEntity> Objects { get; }

        public MongoDbService(IOptions<MongoSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            _database = client.GetDatabase(mongoSettings.Value.DatabaseName);

            Objects = _database.GetCollection<MapObjectEntity>("objects");
        }
    }
}
