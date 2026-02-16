export default function PolygonsPanelContent({
  selectedPolygon,
  isDrawingPolygon,
  draftPolygonPoints,
  getPolygonDisplayLabel,
}) {
  if (selectedPolygon) {
    return (
      <div>
        <div>
          <strong>Selected Polygon</strong>
        </div>
        <div>{getPolygonDisplayLabel(selectedPolygon.id)}</div>
        <div>Vertices: {selectedPolygon.points?.length - 1 ?? 0}</div>
      </div>
    );
  }

  if (isDrawingPolygon) {
    return (
      <div>
        <div>
          <strong>Drawing Polygon</strong>
        </div>
        <div>Points: {draftPolygonPoints?.length ?? 0}</div>
      </div>
    );
  }

  return <div>No polygon selected</div>;
}
