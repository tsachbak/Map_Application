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

  const objectLabelsById = buildLabelMap(objects.savedObjects, "Object");
  const polygonLabelsById = buildLabelMap(polygons.savedPolygons, "Polygon");

  function buildLabelMap(items = [], prefix) {
    const map = new Map();
    if (!Array.isArray(items)) return map;

    items.forEach((item, index) => {
      if (!item?.id) return;
      map.set(item.id, `${prefix} #${index + 1}`);
    });
    return map;
  }

  function getObjectDisplayLabelById(id) {
    return objectLabelsById.get(id) ?? `Object #${id}`;
  }

  function getPolygonDisplayLabelById(id) {
    return polygonLabelsById.get(id) ?? `Polygon #${id}`;
  }

  function getRowDisplayLabel(row) {
    if (!row) return "";

    if (row.rowType === "Object") {
      return getObjectDisplayLabelById(row.sourceId);
    }

    if (row.rowType === "PolygonVertex") {
      const polygonLabel = getPolygonDisplayLabelById(row.groupId);
      const vertexIndex = Number.isInteger(row.vertexIndex)
        ? row.vertexIndex + 1
        : null;
      return vertexIndex !== null
        ? `${polygonLabel} - V${vertexIndex}`
        : polygonLabel;
    }

    return "";
  }

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

  function selectObjectById(id) {
    if (!id) return;

    polygons.setSelectedSavedPolygon(null);
    objects.selectSavedObjectById(id);
  }

  function selectPolygonById(id) {
    if (!id) return;

    objects.setSelectedSavedObject(null);
    polygons.selectSavedPolygonById(id);
  }

  function handleMapDataRowClick(row) {
    if (!row) return;

    if (row.rowType === "Object") {
      selectObjectById(row.sourceId);
      return;
    }

    if (row.rowType === "PolygonVertex") {
      selectPolygonById(row.groupId);
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
            onSavedMarkerClick={selectObjectById}
            selectedSavedObject={objects.selectedSavedObject}
            selectedSavedObjectId={objects.selectedSavedObject?.id ?? null}
            isPolygonClosed={polygons.isPolygonClosed}
            onClosePolygon={polygons.closePolygon}
            savedPolygons={polygons.savedPolygons}
            onSavedPolygonClick={selectPolygonById}
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
                  <div>
                    {getPolygonDisplayLabelById(
                      polygons.selectedSavedPolygon.id,
                    )}
                  </div>
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
                  <div>
                    {getObjectDisplayLabelById(objects.selectedSavedObject.id)}
                  </div>
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
              getRowDisplayLabel={getRowDisplayLabel}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
