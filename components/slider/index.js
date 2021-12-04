export default function Slider({ sub, defaultValue, updateScores }) {
  const handleRangeChange = (event) => {
    event.preventDefault();
    let newValue = event.target.value;
    if (sub.param)
      updateScores({
        [`${sub.param}`]: newValue,
      });
  };

  return (
    <div className="range">
      <input
        type="range"
        className="form-range"
        min="0"
        max="4"
        defaultValue={defaultValue}
        step="1"
        id={`${sub.name}-range`}
        onChange={handleRangeChange}
      />
    </div>
  );
}
