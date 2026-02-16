import "./PanelDetails.css";

export default function ObjectsPanelContent({
  selectedObject,
  getObjectDisplayLabel,
}) {
  if (selectedObject) {
    return (
      <div>
        <div className="panel-details-title">Selected Object</div>
        <div className="panel-details-grid">
          <div className="panel-details-label">Object</div>
          <div className="panel-details-value">
            {getObjectDisplayLabel(selectedObject.id)}
          </div>

          <div className="panel-details-label">Latitude</div>
          <div className="panel-details-value">{selectedObject.lat}</div>

          <div className="panel-details-label">Longitude</div>
          <div className="panel-details-value">{selectedObject.lng}</div>

          <div className="panel-details-label">Type</div>
          <div className="panel-details-value">{selectedObject.type}</div>
        </div>
      </div>
    );
  }

  return <div>No object selected</div>;
}
