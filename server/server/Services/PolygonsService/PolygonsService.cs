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
                return null; // A polygon must have at least 3 points

            // Build the linear ring for the polygon
            var ring = request.Points
                .Select(p => new[] { p.Longitude, p.Latitude })
                .ToList();

            // Ensure the ring is closed by checking if the first and last points are the same
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
                .ToListAsync(ct);

            return polygons;
        }
    }
}
