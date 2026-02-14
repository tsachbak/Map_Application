using Microsoft.Extensions.Options;
using MongoDB.Driver;
using server.Models;
using server.Settings;

namespace server.Services
{
    /// <summary>
    /// Mongo DB Service.
    /// Establishes a connection to the MongoDB database and provides access to the collections used by the application.
    /// </summary>
    public sealed class MongoDbService
    {
        private readonly IMongoDatabase _database;
        public IMongoCollection<MapObjectEntity> ObjectsCollection { get; }
        public IMongoCollection<MapPolygonEntity> PolygonsCollection { get; }

        public MongoDbService(IOptions<MongoSettings> mongoSettings)
        {
            var client = new MongoClient(mongoSettings.Value.ConnectionString);
            var cfg = mongoSettings.Value;

            if (string.IsNullOrWhiteSpace(cfg.ConnectionString))
                throw new ArgumentException("MongoDB connection string is not configured.");

            if (string.IsNullOrWhiteSpace(cfg.DatabaseName))
                throw new ArgumentException("MongoDB database name is not configured.");

            _database = client.GetDatabase(mongoSettings.Value.DatabaseName);

            ObjectsCollection = _database.GetCollection<MapObjectEntity>("objects");
            PolygonsCollection = _database.GetCollection<MapPolygonEntity>("polygons");
            EnsureGeoIndexes();
        }

        // Ensure that the geospatial index on the Location field is created when the service is initialized
        private void EnsureGeoIndexes()
        {
            try
            {
                var objectGeoIndex = new CreateIndexModel<MapObjectEntity>(
                    Builders<MapObjectEntity>.IndexKeys.Geo2DSphere(o => o.Location),
                    new CreateIndexOptions { Name = "ix_objects_location_2dsphere" });

                ObjectsCollection.Indexes.CreateOne(objectGeoIndex);

                var polygonGeoIndex = new CreateIndexModel<MapPolygonEntity>(
                    Builders<MapPolygonEntity>.IndexKeys.Geo2DSphere(p => p.Location),
                    new CreateIndexOptions { Name = "ix_polygons_location_2dsphere" });

                PolygonsCollection.Indexes.CreateOne(polygonGeoIndex);
            }
            catch (MongoCommandException ex)
            {
                if (!ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase))
                    throw; // Rethrow if it's a different error
            }
        }
    }
}
