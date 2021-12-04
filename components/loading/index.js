import Image from "next/image";

export default function Loading(props) {
  return (
    <div>
      <Image
        src="/img/loading.gif"
        alt="Loading..."
        layout="fixed"
        width={100}
        height={100}
      ></Image>
    </div>
  );
}
