export default function ObjectsPanelContent({
  selectedObject,
  getObjectDisplayLabel,
}) {
  if (selectedObject) {
    return (
      <div>
        <div>
          <strong>Selected Object</strong>
        </div>
        <div>{getObjectDisplayLabel(selectedObject.id)}</div>
        <div>Latitude: {selectedObject.lat}</div>
        <div>Longitude: {selectedObject.lng}</div>
        <div>Type: {selectedObject.type}</div>
      </div>
    );
  }

  return <div>No object selected</div>;
}
