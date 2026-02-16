import "./PanelDetails.css";
import { SYMBOL_TYPE_OPTIONS } from "../../features/objects/symbolLibrary";
import { getObjectSymbolPreviewUrl } from "../../features/objects/symbolLibrary";

export default function ObjectsPanelContent({
  selectedObject,
  getObjectDisplayLabel,
  isAddingObject,
  selectedObjectType,
  onSelectedObjectTypeChange,
}) {
  const previewUrl = selectedObject
    ? getObjectSymbolPreviewUrl(selectedObject.type)
    : null;

  return (
    <div>
      {isAddingObject ? (
        <div style={{ marginBottom: 12 }}>
          <div className="panel-details-title">New Object Type</div>

          <select
            value={selectedObjectType ?? "marker"}
            onChange={(e) => onSelectedObjectTypeChange?.(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            {SYMBOL_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Click on the map to add new objects.
          </div>
        </div>
      ) : null}

      {selectedObject ? (
        <div>
          <div className="panel-details-title">Selected Object</div>

          <div className="panel-details-row">
            <div className="panel-details-left">
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

            {previewUrl ? (
              <div className="panel-details-preview">
                <img
                  src={previewUrl}
                  alt={`${selectedObject.type} symbol`}
                  className="panel-details-preview-image"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div>No object selected</div>
      )}
    </div>
  );
}
