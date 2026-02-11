import "./PanelActions.css";

/**
 * PanelActions component provides buttons for adding, saving, and deleting items in the panel.
 */
export default function PanelActions() {
  return (
    <div className="panel-actions-root">
      <button type="button" className="panel-actions-button">
        Add
      </button>
      <button type="button" className="panel-actions-button">
        Save
      </button>
      <button type="button" className="panel-actions-button">
        Delete
      </button>
    </div>
  );
}
