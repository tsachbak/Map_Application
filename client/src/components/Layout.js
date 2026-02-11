import Panel from "./Panel";
import PanelActions from "./PanelActions";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 */
export default function Layout() {
  return (
    <div>
      <h1>Map Application</h1>
      <div>
        <div>Map Area</div>

        <div>
          <Panel title="Polygons" actions={<PanelActions />}>
            <div>Polygon placement and editing tools will go here.</div>
          </Panel>

          <Panel title="Objects" actions={<PanelActions />}>
            <div>Object placement and editing tools will go here.</div>
          </Panel>

          <Panel title="Map Data">
            <div>Map data table will go here.</div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
