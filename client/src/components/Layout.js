import { useState, useEffect } from "react";
import MapDataTablePlaceholder from "./MapDataTablePlaceholder";
import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import "./Layout.css";

import { getObjects, saveObjects, deleteObject } from "../api/objectsApi";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  //states for managing Objects
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [savedObjects, setSavedObjects] = useState([]);
  const [draftObjects, setDraftObjects] = useState([]);
  const [selectedSavedObject, setSelectedSavedObject] = useState(null);

  //states for managing Polygon
  const [isDrawingPolygon, setIsDrawingPolygon] = useState(false);
  const [draftPolygonPoints, setDraftPolygonPoints] = useState([]);

  function createId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function loadObjects() {
    try {
      const data = await getObjects();

      const mapped = (data ?? [])
        .map((o) => {
          if (!o?.id) return null;

          return {
            id: o.id,
            Object: o.object ?? "",
            lat: o.latitude,
            lng: o.longitude,
            type: o.type ?? "marker",
          };
        })
        .filter(Boolean);
      setSavedObjects(mapped);
    } catch (error) {
      console.error("[Layout] failed to load objects:", error);
    }
  }

  useEffect(() => {
    loadObjects();
  }, []);

  function handleMapClick(lat, lng) {
    if (isDrawingPolygon) {
      setDraftPolygonPoints((prev) => [...prev, { lat, lng }]);
      return;
    }

    if (isAddingObject) {
      const newDraftObject = {
        id: createId(),
        lat,
        lng,
      };

      setDraftObjects((prev) => [...prev, newDraftObject]);
    }
    return;
  }

  async function handleSaveObjects() {
    if (isDrawingPolygon) return;
    if (draftObjects.length === 0) return;

    try {
      const response = await saveObjects(draftObjects);
      console.log("[Layout] server response:", response);

      await loadObjects();

      setDraftObjects([]);
      setIsAddingObject(false);
    } catch (error) {
      console.error("[Layout] failed to save objects:", error);
      alert(error.message);
    }
  }

  function handleSavedMarkerClick(objectId) {
    const selectedObject = savedObjects.find((o) => o.id === objectId) ?? null;
    setSelectedSavedObject(selectedObject);
  }

  function handleToggleAddObject() {
    setIsAddingObject((prev) => {
      const next = !prev;

      if (next) {
        setIsDrawingPolygon(false);
        setDraftPolygonPoints([]);
      }

      if (!next) {
        setDraftObjects([]);
      }

      return next;
    });
  }

  function handleToggleDrawPolygon() {
    setIsDrawingPolygon((prev) => {
      const next = !prev;

      if (next) {
        setIsAddingObject(false);
        setDraftObjects([]);
        setSelectedSavedObject(null);
        setDraftPolygonPoints([]);
      }

      if (!next) {
        setDraftPolygonPoints([]);
      }

      return next;
    });
  }

  async function handleDeleteSelectedObject() {
    if (!selectedSavedObject?.id) return;

    try {
      await deleteObject(selectedSavedObject.id);

      await loadObjects();
      setSelectedSavedObject(null);
    } catch (error) {
      console.error("[Layout] failed to delete object:", error);
      alert(error.message);
    }
  }

  return (
    <div>
      <h1>Map Application</h1>
      <div className="layout-root">
        <div className="layout-map">
          <MapView
            savedObjects={savedObjects}
            draftObjects={draftObjects}
            draftPolygonPoints={draftPolygonPoints}
            onMapClick={handleMapClick}
            onSavedMarkerClick={handleSavedMarkerClick}
            selectedSavedObject={selectedSavedObject}
            selectedSavedObjectId={selectedSavedObject?.id ?? null}
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
                addActive={isAddingObject}
                onAddClick={handleToggleAddObject}
                onSaveClick={handleSaveObjects}
                onDeleteClick={handleDeleteSelectedObject}
                deleteDisabled={!selectedSavedObject?.id}
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <div>
              {selectedSavedObject ? (
                <div>
                  <div>
                    <strong>Selected Object</strong>
                  </div>
                  <div>ID: {selectedSavedObject.id}</div>
                  <div>Object: {selectedSavedObject.object || "-"}</div>
                  <div>Latitude: {selectedSavedObject.lat}</div>
                  <div>Longitude: {selectedSavedObject.lng}</div>
                  <div>Type: {selectedSavedObject.type}</div>
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
