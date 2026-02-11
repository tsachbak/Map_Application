/**
 * this component is a simple wrapper for a section of the UI.
 * It provides a title, an optional set of actions, and a container for child components.
 */
export default function Panel({ title, actions, children }) {
  return (
    <section>
      <h2>{title}</h2>

      {actions ? <div>{actions}</div> : null}

      <div>{children}</div>
    </section>
  );
}
