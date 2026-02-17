import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import MapDataTable from "./MapDataTable";
import PolygonsPanelContent from "./panels/PolygonsPanelContent";
import ObjectsPanelContent from "./panels/ObjectsPanelContent";
import { clearAllMapData, exportMapDataGeoJson } from "../api/mapDataApi";
import {
  buildLabelMap,
  getObjectDisplayLabelById,
  getPolygonDisplayLabelById,
  getRowDisplayLabel,
} from "../utils/displayLabels";
import { saveBlobAs } from "../utils/fileSave";
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
    <div className="app-root">
      <div className="app-header">
        <h1 className="app-title">Map Application</h1>
        <button
          className="danger-button"
          type="button"
          onClick={async () => {
            try {
              const { blob, fileName } = await exportMapDataGeoJson();
              await saveBlobAs(
                blob,
                fileName || "map_data.geojson",
                "application/geo+json",
              );
            } catch (error) {
              console.error("[Layout] Failed to export map data:", error);
              alert(error.message);
            }
          }}
        >
          Export Map Data
        </button>
        <button
          className="danger-button"
          type="button"
          onClick={async () => {
            const confirmed = window.confirm(
              "This will delete ALL Objects and Polygons from the server.\nAre you sure you want to continue?",
            );
            if (!confirmed) return;
            console.warn("Deleting all map data...");

            try {
              await clearAllMapData();

              objects.setSelectedSavedObject(null);
              objects.setDraftObjects([]);
              objects.setIsAddingObject(false);

              polygons.setSelectedSavedPolygon(null);
              polygons.resetDraft();

              await objects.loadObjects();
              await polygons.loadPolygons();
              await mapData.refresh();
            } catch (error) {
              console.error("[Layout] Failed to clear map data:", error);
              alert(error.message);
            }
          }}
        >
          Clear Map Data
        </button>
      </div>
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
                    polygons.setSelectedSavedPolygon(null);
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
                saveDisabled={
                  !!polygons.selectedSavedPolygon || !polygons.isPolygonClosed
                }
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <PolygonsPanelContent
              selectedPolygon={polygons.selectedSavedPolygon}
              isDrawingPolygon={polygons.isDrawingPolygon}
              draftPolygonPoints={polygons.draftPolygonPoints}
              getPolygonDisplayLabel={(id) =>
                getPolygonDisplayLabelById(id, polygonLabelsById)
              }
            />
          </Panel>

          <Panel
            title="Objects"
            actions={
              <PanelActions
                addActive={objects.isAddingObject}
                onAddClick={() => {
                  if (!objects.isAddingObject) {
                    polygons.stopDrawMode();
                    polygons.setSelectedSavedPolygon(null);
                    objects.setSelectedSavedObject(null);
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
                saveDisabled={
                  !objects.draftObjects || objects.draftObjects.length === 0
                }
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <ObjectsPanelContent
              selectedObject={objects.selectedSavedObject}
              getObjectDisplayLabel={(id) =>
                getObjectDisplayLabelById(id, objectLabelsById)
              }
              isAddingObject={objects.isAddingObject}
              selectedObjectType={objects.selectedObjectType}
              onSelectedObjectTypeChange={objects.setSelectedObjectType}
            />
          </Panel>

          <Panel title="Map Data">
            <MapDataTable
              rows={mapData.rows}
              loading={mapData.loading}
              error={mapData.error}
              selectedObjectId={objects.selectedSavedObject?.id ?? null}
              selectedPolygonId={polygons.selectedSavedPolygon?.id ?? null}
              onRowClick={handleMapDataRowClick}
              getRowDisplayLabel={(row) =>
                getRowDisplayLabel(row, objectLabelsById, polygonLabelsById)
              }
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
