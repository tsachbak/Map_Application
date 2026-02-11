import "./Panel.css";

/**
 * this component is a simple wrapper for a section of the UI.
 * It provides a title, an optional set of actions, and a container for child components.
 */
export default function Panel({ title, actions, children }) {
  return (
    <section className="panel-root">
      <h2 className="panel-title">{title}</h2>

      {actions ? <div className="panel-actions">{actions}</div> : null}

      <div className="panel-body">{children}</div>
    </section>
  );
}
