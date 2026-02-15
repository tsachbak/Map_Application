import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import MapDataTable from "./MapDataTable";
import "./Layout.css";

import useObjects from "../features/objects/useObjects";
import usePolygons from "../features/polygons/usePolygons";
import useMapData from "../features/mapData/useMapData";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  const objects = useObjects();
  const polygons = usePolygons();
  const mapData = useMapData();

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

  function handleMapDataRowClick(row) {
    if (!row) return;

    if (row.rowType === "Object") {
      polygons.setSelectedSavedPolygon(null);
      objects.selectSavedObjectById(row.sourceId);
      return;
    }

    if (row.rowType === "PolygonVertex") {
      objects.setSelectedSavedObject(null);
      polygons.selectSavedPolygonById(row.groupId);
      return;
    }
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
            savedPolygons={polygons.savedPolygons}
            onSavedPolygonClick={polygons.selectSavedPolygonById}
            selectedSavedPolygonId={polygons.selectedSavedPolygon?.id ?? null}
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
                onSaveClick={async () => {
                  await polygons.saveClosedPolygonAsync();
                  await mapData.refresh();
                }}
                onDeleteClick={async () => {
                  await polygons.deleteSelectedPolygonAsync();
                  await mapData.refresh();
                }}
                deleteDisabled={!polygons.selectedSavedPolygon?.id}
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <div>
              {polygons.selectedSavedPolygon ? (
                <div>
                  <div>
                    <strong>Selected Polygon</strong>
                  </div>
                  <div>ID: {polygons.selectedSavedPolygon.id}</div>
                  <div>Name: {polygons.selectedSavedPolygon.name || "-"}</div>
                  <div>
                    Vertices:{" "}
                    {polygons.selectedSavedPolygon.points?.length - 1 ?? 0}
                  </div>
                </div>
              ) : polygons.isDrawingPolygon ? (
                <div>
                  <div>
                    <strong>Drawing Polygon</strong>
                  </div>
                  <div>Points: {polygons.draftPolygonPoints?.length ?? 0}</div>
                </div>
              ) : (
                <div>No polygon selected</div>
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
                onSaveClick={async () => {
                  await objects.saveDraftObjectsAsync();
                  await mapData.refresh();
                }}
                onDeleteClick={async () => {
                  await objects.deleteObjectByIdAsync(
                    objects.selectedSavedObject?.id,
                  );
                  await mapData.refresh();
                }}
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
            <MapDataTable
              rows={mapData.rows}
              loading={mapData.loading}
              error={mapData.error}
              selectedObjectId={objects.selectedSavedObject?.id ?? null}
              selectedPolygonId={polygons.selectedSavedPolygon?.id ?? null}
              onRowClick={handleMapDataRowClick}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
