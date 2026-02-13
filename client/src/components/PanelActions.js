import "./PanelActions.css";

/**
 * PanelActions component provides buttons for adding, saving, and deleting items in the panel.
 */
export default function PanelActions({
  addActive,
  onAddClick,
  onSaveClick,
  onDeleteClick,
  deleteDisabled = false,
  addLabelOff = "Add",
  addLabelOn = "Stop Adding",
}) {
  const addText = addActive ? addLabelOn : addLabelOff;

  return (
    <div className="panel-actions-root">
      <button
        type="button"
        className="panel-actions-button"
        onClick={onAddClick}
        disabled={!onAddClick}
      >
        {addText}
      </button>
      <button
        type="button"
        className="panel-actions-button"
        onClick={onSaveClick}
        disabled={!onSaveClick}
      >
        Save
      </button>
      <button
        type="button"
        className="panel-actions-button"
        onClick={onDeleteClick}
        disabled={!onDeleteClick || deleteDisabled}
      >
        Delete
      </button>
    </div>
  );
}
