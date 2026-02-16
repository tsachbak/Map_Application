using MongoDB.Driver;
using server.Dtos.Objects;
using server.Models;

namespace server.Services.ObjectsService
{
    public class ObjectsService : IObjectsService
    {
        private readonly MongoDbService _mongoDbService;

        public ObjectsService(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        public async Task<int> SaveObjectsAsync(SaveObjectsRequestDto request, CancellationToken ct = default)
        {
            if (request?.Objects == null || request.Objects.Count == 0)
            {
                return 0; // No objects to save
            }

            var entities = request.Objects.Select(o => new MapObjectEntity
            {
                Object = o.Object,
                Type = o.Type,
                Location = new GeoJsonPoint
                {
                    Type = "Point",
                    Coordinates = new[] {o.Longitude, o.Latitude }
                }
            }).ToList();

            await _mongoDbService.ObjectsCollection.InsertManyAsync(entities, cancellationToken: ct);
            return entities.Count;
        }

        public async Task<IReadOnlyList<MapObjectEntity>> GetAllObjectsAsync(CancellationToken ct = default)
        {
            var objects = await _mongoDbService.ObjectsCollection
                .Find(Builders<MapObjectEntity>.Filter.Empty)
                .SortBy(o => o.Id)
                .ToListAsync(ct);

            return objects;
        }

        public async Task<bool> DeleteObjectAsync(string id, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(id))
                return false; // Invalid ID

            var filter = Builders<MapObjectEntity>.Filter.Eq(o => o.Id, id);

            var result = await _mongoDbService.ObjectsCollection.DeleteOneAsync(filter, ct);
            return result.DeletedCount > 0;
        }
    }
}
