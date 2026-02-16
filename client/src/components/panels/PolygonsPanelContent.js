export default function PolygonsPanelContent({
  selectedPolygon,
  isDrawingPolygon,
  draftPolygonPoints,
  getPolygonDisplayLabel,
}) {
  if (selectedPolygon) {
    const verticesCount = selectedPolygon.points?.length
      ? selectedPolygon.points.length - 1
      : 0;

    return (
      <div>
        <div className="panel-details-title">Selected Polygon</div>
        <div className="panel-details-grid">
          <div className="panel-details-label">Polygon</div>
          <div className="panel-details-value">
            {getPolygonDisplayLabel(selectedPolygon.id)}
          </div>
          <div className="panel-details-label">Vertices</div>
          <div className="panel-details-value">{verticesCount}</div>
        </div>
      </div>
    );
  }

  if (isDrawingPolygon) {
    return (
      <div>
        <div className="panel-details-title">Drawing Polygon</div>
        <div className="panel-details-grid">
          <div className="panel-details-label">Points</div>
          <div className="panel-details-value">
            {draftPolygonPoints?.length ?? 0}
          </div>
        </div>
      </div>
    );
  }

  return <div>No polygon selected</div>;
}
