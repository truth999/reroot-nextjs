import Image from "next/image";
import styles from "./Card.module.scss";

export default function Card(props) {
  return (
    <div className={`${styles.card} text-center`}>
      <Image
        className="card-img-top"
        src={props.src}
        layout="intrinsic"
        objectFit="cover"
        width={206}
        height={216}
        alt="step"
      />
      <div className={`card-body`}>
        <p className={`card-text ${styles.text}`}>{props.children}</p>
      </div>
    </div>
  );
}
