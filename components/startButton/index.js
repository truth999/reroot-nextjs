import Link from "next/link";
import Image from "next/image";
import styles from "./startButton.module.scss";

export default function StartButton(props) {
  return (
    <Link href={props.to}>
      <a>
        <button className={`btn ${styles.btnStart}`}>{props.children}</button>
      </a>
    </Link>
  );
}
