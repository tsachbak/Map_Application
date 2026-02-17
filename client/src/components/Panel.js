import "./Panel.css";

/**
 * Reusable panel wrapper with a title, optional action slot, and content area.
 */
export default function Panel({ title, actions, children }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      <div className="panel-content">{children}</div>
    </section>
  );
}
