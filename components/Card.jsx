import Image from "next/image";
import styles from "./Card.module.scss";

export default function Card(props) {
  return (
    <div className={`${styles.card} text-center`}>
      <Image
        className="card-img-top"
        src={props.src}
        objectFit="fill"
        width={138}
        height={150}
        alt="step"
      />
      <div className={`card-body`}>{props.children}</div>
    </div>
  );
}
