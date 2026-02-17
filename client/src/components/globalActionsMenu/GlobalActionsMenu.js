import { useEffect, useRef, useState } from "react";
import "./GlobalActionsMenu.css";

export default function GlobalActionsMenu({
  onExportClick,
  onClearClick,
  importDisabled = true,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleDocumentMouseDown(e) {
      if (!open) return;
      if (!rootRef.current) return;

      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () =>
      document.removeEventListener("mousedown", handleDocumentMouseDown);
  }, [open]);

  return (
    <div className="global-actions-root" ref={rootRef}>
      <button
        type="button"
        className="global-actions-button"
        aria-label="Open actions menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        ☰
      </button>

      {open ? (
        <div className="global-actions-menu" role="menu">
          <button
            type="button"
            className="global-actions-menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onExportClick?.();
            }}
          >
            Export to GeoJSON
          </button>

          <button
            type="button"
            className="global-actions-menu-item"
            role="menuitem"
            disabled={importDisabled}
            onClick={() => {
              setOpen(false);
            }}
            title={importDisabled ? "Import will be added later" : ""}
          >
            Import from GeoJSON
          </button>

          <div className="global-actions-divider" />

          <button
            type="button"
            className="global-actions-menu-item global-actions-danger"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onClearClick?.();
            }}
          >
            Clear All Map Data
          </button>
        </div>
      ) : null}
    </div>
  );
}
