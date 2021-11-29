import Image from "next/image";

export default function AdjustButton(props) {
  return (
    <Image
      src={`${props.collapse ? "/img/collapse.png" : "/icon/adjust.svg"}`}
      alt="adjust"
      height={props.side}
      width={props.side}
    ></Image>
  );
}
