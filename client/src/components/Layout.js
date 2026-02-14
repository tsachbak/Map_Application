import MapDataTablePlaceholder from "./MapDataTablePlaceholder";
import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import "./Layout.css";

import useObjects from "../features/objects/useObjects";
import usePolygons from "../features/polygons/usePolygons";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  const objects = useObjects();
  const polygons = usePolygons();

  function handleMapClick(lat, lng) {
    if (polygons.isDrawingPolygon) {
      polygons.addPoint(lat, lng);
      return;
    }

    if (objects.isAddingObject) {
      objects.addDraftObject(lat, lng);
    }
    return;
  }

  return (
    <div>
      <h1>Map Application</h1>
      <div className="layout-root">
        <div className="layout-map">
          <MapView
            savedObjects={objects.savedObjects}
            draftObjects={objects.draftObjects}
            draftPolygonPoints={polygons.draftPolygonPoints}
            onMapClick={handleMapClick}
            onSavedMarkerClick={objects.selectSavedObjectById}
            selectedSavedObject={objects.selectedSavedObject}
            selectedSavedObjectId={objects.selectedSavedObject?.id ?? null}
            isPolygonClosed={polygons.isPolygonClosed}
            onClosePolygon={polygons.closePolygon}
          />
        </div>

        <div className="layout-side">
          <Panel
            title="Polygons"
            actions={
              <PanelActions
                addActive={polygons.isDrawingPolygon}
                onAddClick={() => {
                  if (!polygons.isDrawingPolygon) {
                    objects.stopAddMode();
                    objects.setSelectedSavedObject(null);
                    polygons.startDrawMode();
                    return;
                  }
                  polygons.stopDrawMode();
                }}
                onSaveClick={null}
                onDeleteClick={null}
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <div>
              {polygons.isDrawingPolygon ? (
                <div>
                  <div>
                    <strong>Drawing Polygon</strong>
                  </div>
                  <div>Points: {polygons.draftPolygonPoints.length}</div>
                </div>
              ) : (
                <div>Click Add to start drawing a polygon.</div>
              )}
            </div>
          </Panel>

          <Panel
            title="Objects"
            actions={
              <PanelActions
                addActive={objects.isAddingObject}
                onAddClick={() => {
                  if (!objects.isAddingObject) {
                    polygons.stopDrawMode();
                  }
                  objects.toggleAddMode();
                }}
                onSaveClick={objects.saveDraftObjectsAsync}
                onDeleteClick={() =>
                  objects.deleteObjectByIdAsync(objects.selectedSavedObject?.id)
                }
                deleteDisabled={!objects.selectedSavedObject?.id}
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <div>
              {objects.selectedSavedObject ? (
                <div>
                  <div>
                    <strong>Selected Object</strong>
                  </div>
                  <div>ID: {objects.selectedSavedObject.id}</div>
                  <div>Object: {objects.selectedSavedObject.object || "-"}</div>
                  <div>Latitude: {objects.selectedSavedObject.lat}</div>
                  <div>Longitude: {objects.selectedSavedObject.lng}</div>
                  <div>Type: {objects.selectedSavedObject.type}</div>
                </div>
              ) : (
                <div>No object selected</div>
              )}
            </div>
          </Panel>

          <Panel title="Map Data">
            <MapDataTablePlaceholder />
          </Panel>
        </div>
      </div>
    </div>
  );
}
