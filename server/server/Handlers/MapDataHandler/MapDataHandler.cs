using server.Dtos.MapData;
using server.Dtos.MapData.GeoJson;
using server.Models;
using server.Services.ObjectsService;
using server.Services.PolygonsService;

namespace server.Handlers.MapDataHandler
{
    public class MapDataHandler : IMapDataHandler
    {
        private readonly IObjectsService _objectsService;
        private readonly IPolygonsService _polygonsService;

        public MapDataHandler(IObjectsService objectsService, IPolygonsService polygonsService)
        {
            _objectsService = objectsService;
            _polygonsService = polygonsService;
        }

        public async Task<IReadOnlyList<MapDataRowDto>> GetRowsAsync(CancellationToken ct = default)
        {
            var rows = new List<MapDataRowDto>();

            var objects = await _objectsService.GetAllObjectsAsync(ct);
            foreach (var obj in objects)
            {
                var id = obj.Id ?? string.Empty;

                rows.Add(new MapDataRowDto
                {
                    RowType = "Object",
                    Latitude = obj.Location.Coordinates[1],
                    Longitude = obj.Location.Coordinates[0],
                    SourceId = id,
                    GroupId = null,
                    VertexIndex = null
                });
            }

            var polygons = await _polygonsService.GetAllPolygonsAsync(ct);
            foreach (var poly in polygons)
            {
                var polygonId = poly.Id ?? string.Empty;

                var outerRing = poly.Location.Coordinates.FirstOrDefault();
                if (outerRing == null || outerRing.Count == 0)
                    continue;

                for (int i = 0; i < outerRing.Count - 1; i++)
                {
                    var vertex = outerRing[i];
                    if (vertex == null || vertex.Length < 2)
                        continue;

                    var longitude = vertex[0];
                    var latitude = vertex[1];

                    rows.Add(new MapDataRowDto
                    {
                        RowType = "PolygonVertex",
                        Latitude = latitude,
                        Longitude = longitude,
                        SourceId = polygonId,
                        GroupId = polygonId,
                        VertexIndex = i
                    });
                }
            }

            return rows;
        }

        public async Task<ClearMapResponseDto> ClearMapDataAsync(CancellationToken ct = default)
        {
            var deletedObjectsCount = await _objectsService.DeleteAllObjectsAsync(ct);
            var deletedPolygonsCount = await _polygonsService.DeleteAllPolygonsAsync(ct);

            return new ClearMapResponseDto
            {
                DeletedObjectsCount = deletedObjectsCount,
                DeletedPolygonsCount = deletedPolygonsCount
            };
        }

        public async Task<GeoJsonFeatureCollectionDto> ExportGeoJsonAsync(CancellationToken ct = default) 
        {
            var objects = await _objectsService.GetAllObjectsAsync(ct);
            var polygons = await _polygonsService.GetAllPolygonsAsync(ct);

            return BuildFeatureCollection(objects, polygons);
        }

        // Merge object and polygon entities into one GeoJSON feature collection.
        private static GeoJsonFeatureCollectionDto BuildFeatureCollection(
            IReadOnlyList<MapObjectEntity> objects, 
            IReadOnlyList<MapPolygonEntity> polygons)
        {
            var featureCollection = new GeoJsonFeatureCollectionDto();

            if (objects != null)
            {
                foreach (var obj in objects)
                {
                    featureCollection.Features.Add(BuildObjectFeature(obj));
                }
            }

            if (polygons != null)
            {
                foreach (var poly in polygons)
                {
                    featureCollection.Features.Add(BuildPolygonFeature(poly));
                }
            }

            return featureCollection;
        }

        private static GeoJsonFeatureDto BuildObjectFeature(MapObjectEntity obj)
        {
            return new GeoJsonFeatureDto
            {
                Geometry = obj.Location,
                Properties = new Dictionary<string, object>
                {
                    ["entityType"] = "Object",
                    ["id"] = obj.Id ?? string.Empty,
                    ["object"] = obj.Object ?? string.Empty,
                    ["type"] = obj.Type ?? "marker"
                }
            };
        }

        private static GeoJsonFeatureDto BuildPolygonFeature(MapPolygonEntity poly)
        {
            return new GeoJsonFeatureDto
            {
                Geometry = poly.Location,
                Properties = new Dictionary<string, object>
                {
                    ["entityType"] = "Polygon",
                    ["id"] = poly.Id ?? string.Empty,
                    ["name"] = poly.Name ?? "polygon"
                }
            };
        }
    }
}
