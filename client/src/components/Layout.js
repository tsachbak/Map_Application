import { useState, useEffect } from "react";
import MapDataTablePlaceholder from "./MapDataTablePlaceholder";
import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import "./Layout.css";

import { getObjects, saveObjects } from "../api/objectsApi";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [savedObjects, setSavedObjects] = useState([]);
  const [draftObjects, setDraftObjects] = useState([]);

  function createId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function loadObjects() {
    try {
      const data = await getObjects();

      const mapped = (data ?? [])
        .map((o) => {
          const coords = o?.location?.coordinates;

          if (!Array.isArray(coords) || coords.length < 2) return null;

          return {
            id: o.object ?? o._id,
            lat: coords[1],
            lng: coords[0],
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
    if (!isAddingObject) return;

    const newDraftObject = {
      id: createId(),
      lat,
      lng,
    };

    setDraftObjects((prev) => [...prev, newDraftObject]);
  }

  async function handleSaveObjects() {
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

  function handleToggleAddObject() {
    setIsAddingObject((prev) => !prev);
  }

  return (
    <div>
      <h1>Map Application</h1>
      <div className="layout-root">
        <div className="layout-map">
          <MapView
            savedObjects={savedObjects}
            draftObjects={draftObjects}
            onMapClick={handleMapClick}
          />
        </div>

        <div className="layout-side">
          <Panel title="Polygons" actions={<PanelActions />}>
            <div>Polygon placement and editing tools will go here.</div>
          </Panel>

          <Panel
            title="Objects"
            actions={
              <PanelActions
                addActive={isAddingObject}
                onAddClick={handleToggleAddObject}
                onSaveClick={handleSaveObjects}
                addLabelOff="Add"
                addLabelOn="Stop"
              />
            }
          >
            <div>Object placement and editing tools will go here.</div>
          </Panel>

          <Panel title="Map Data">
            <MapDataTablePlaceholder />
          </Panel>
        </div>
      </div>
    </div>
  );
}
