import Link from "next/link";
import Image from "next/image";
import styles from "./startButton.module.scss";
import Button from "react-bootstrap/Button";
export default function StartButton(props) {
  return (
    <Link href={props.to} passHref>
      <a>
        <Button className={`${styles.btnStart}`}>{props.children}</Button>
      </a>
    </Link>
  );
}
