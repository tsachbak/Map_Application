import Panel from "./Panel";

/**
 * this component will be the main layout of the application,
 * containing the map and the panels for polygons, objects, and map data (as table).
 * @returns JSX.Element
 */
export default function Layout() {
  return (
    <div>
      <h1>Map Application</h1>
      <div>
        <div>Map Area</div>

        <div>
          <Panel title="Polygons">
            <div>Polygon placement and editing tools will go here.</div>
          </Panel>

          <Panel title="Objects">
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
