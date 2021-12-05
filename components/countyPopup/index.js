export default function CountyPopup({ stats, county }) {
  const suffixLookup = {
    percentage: "%",
    index: "",
    median: "",
    count: "",
    density: "",
  };
  const prefixLookup = {
    percentage: "",
    index: "",
    median: "$",
    count: "",
    density: "",
  };

  return (
    <div className="container">
      <h2>
        <a
          href={`https://en.wikipedia.org/wiki/${county.name}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {county.name}
        </a>
      </h2>
      <ul className="list-group py-3">
        {stats.map((stat) => (
          <li
            key={stat.name}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">{stat.text}</div>
              <ul className="list-group py-2">
                {stat.sub.map((sub_stat) => {
                  const prefix = prefixLookup[sub_stat.metric];
                  const suffix = suffixLookup[sub_stat.metric];
                  return (
                    <li key={sub_stat.name} className="pb-1">
                      {`${sub_stat.text}: ${prefix}${sub_stat.value}${suffix}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
