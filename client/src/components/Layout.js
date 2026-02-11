import MapDataTablePlaceholder from "./MapDataTablePlaceholder";
import Panel from "./Panel";
import PanelActions from "./PanelActions";
import MapView from "./MapView";
import "./Layout.css";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  return (
    <div>
      <h1>Map Application</h1>
      <div className="layout-root">
        <div className="layout-map">
          <MapView />
        </div>

        <div className="layout-side">
          <Panel title="Polygons" actions={<PanelActions />}>
            <div>Polygon placement and editing tools will go here.</div>
          </Panel>

          <Panel title="Objects" actions={<PanelActions />}>
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
