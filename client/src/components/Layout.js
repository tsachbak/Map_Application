import { useState } from "react";
import MapDataTablePlaceholder from "./MapDataTablePlaceholder";
import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import "./Layout.css";

import useObjects from "../features/objects/useObjects";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  //states for managing Polygon
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [draftPolygonPoints, setDraftPolygonPoints] = useState([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);

  // useObjects hook manages the state and operations related to map objects.
  const objects = useObjects();

  function handleMapClick(lat, lng) {
    if (isDrawingPolygon) {
      setDraftPolygonPoints((prev) => [...prev, { lat, lng }]);
      return;
    }

    if (objects.isAddingObject) {
      objects.addDraftObject(lat, lng);
    }
    return;
  }

  function handleToggleDrawPolygon() {
    setIsPolygonClosed(false);
    setIsDrawingPolygon((prev) => {
      const next = !prev;

      if (next) {
        objects.stopAddMode();
        objects.setSelectedSavedObject(null);
        setDraftPolygonPoints([]);
      }

      if (!next) {
        setDraftPolygonPoints([]);
      }

      return next;
    });
  }

  function handleClosePolygon() {
    if (draftPolygonPoints.length < 3) return;

    setIsPolygonClosed(true);
    setIsDrawingPolygon(false);
  }

  return (
    <div>
      <h1>Map Application</h1>
      <div className="layout-root">
        <div className="layout-map">
          <MapView
            savedObjects={objects.savedObjects}
            draftObjects={objects.draftObjects}
            draftPolygonPoints={draftPolygonPoints}
            onMapClick={handleMapClick}
            onSavedMarkerClick={objects.selectSavedObjectById}
            selectedSavedObject={objects.selectedSavedObject}
            selectedSavedObjectId={objects.selectedSavedObject?.id ?? null}
            isPolygonClosed={isPolygonClosed}
            onClosePolygon={handleClosePolygon}
          />
        </div>

        <div className="layout-side">
          <Panel
            title="Polygons"
            actions={
              <PanelActions
                addActive={isDrawingPolygon}
                onAddClick={handleToggleDrawPolygon}
                onSaveClick={null}
                onDeleteClick={null}
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <div>
              {isDrawingPolygon ? (
                <div>
                  <div>
                    <strong>Drawing Polygon</strong>
                  </div>
                  <div>Points: {draftPolygonPoints.length}</div>
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
                onAddClick={objects.toggleAddMode}
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
