import Link from "next/link";
import styles from "./StartButton.module.scss";

export default function StartButton() {
  return (
    <Link href="/survey">
      <a>
        <button className={`btn ${styles.btnStart}`}>Start Survey</button>
      </a>
    </Link>
  );
}
