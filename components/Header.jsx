import { useRouter } from "next/router";
import Image from "next/image";
import styles from "./Header.module.scss";

const Header = () => {
  const router = useRouter();
  return (
    <header className={`${styles.header}`}>
      {router.pathname !== "/" && (
        <Image
          className="back"
          alt="back button"
          src="/img/back.png"
          layout="fixed"
          width={44}
          height={44}
          onClick={() => router.back()}
        />
      )}
    </header>
  );
};
export default Header;
