using MongoDB.Driver;
using server.Dtos.Polygons;
using server.Models;

namespace server.Services.PolygonsService
{
    public class PolygonsService : IPolygonsService
    {
        private readonly MongoDbService _mongoDbService;

        public PolygonsService(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        public async Task<string?> SavePolygonAsync(SavePolygonRequestDto request, CancellationToken ct = default)
        {
            if (request?.Points == null || request.Points.Count < 3)
                return null;

            // GeoJSON polygon ring uses [longitude, latitude] coordinates.
            var ring = request.Points
                .Select(p => new[] { p.Longitude, p.Latitude })
                .ToList();

            // Close the ring when the first and last coordinates are different.
            var firstPoint = ring[0];
            var lastPoint = ring[ring.Count - 1];
            if (firstPoint[0] != lastPoint[0] || firstPoint[1] != lastPoint[1])
            {
                ring.Add(new[] { firstPoint[0], firstPoint[1] });
            }

            var entity = new MapPolygonEntity
            {
                Name = string.IsNullOrWhiteSpace(request.Name) ? "polygon" : request.Name,
                Location = new GeoJsonPolygon
                {
                    Type = "Polygon",
                    Coordinates = new List<List<double[]>> { ring }
                }
            };

            await _mongoDbService.PolygonsCollection.InsertOneAsync(entity, cancellationToken: ct);
            return entity.Id;
        }

        public async Task<IReadOnlyList<MapPolygonEntity>> GetAllPolygonsAsync(CancellationToken ct = default)
        {
            var polygons = await _mongoDbService.PolygonsCollection
                .Find(Builders<MapPolygonEntity>.Filter.Empty)
                .SortBy(p => p.Id)
                .ToListAsync(ct);

            return polygons;
        }

        public async Task<bool> DeletePolygonAsync(string id, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(id))
                return false;

            var filter = Builders<MapPolygonEntity>.Filter.Eq(p => p.Id, id);

            var result = await _mongoDbService.PolygonsCollection.DeleteOneAsync(filter, ct);

            return result.DeletedCount > 0;
        }

        public async Task<long> DeleteAllPolygonsAsync(CancellationToken ct = default)
        {
            var result = await _mongoDbService.PolygonsCollection
                .DeleteManyAsync(Builders<MapPolygonEntity>.Filter.Empty, ct);

            return result?.DeletedCount ?? 0;
        }
    }
}
