import styles from "./searchBar.module.scss";

export default function SearchBar(props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className={styles.search}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  );
}
