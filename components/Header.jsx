import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.scss";

const Header = () => {
  const router = useRouter();
  return (
    <header className={`${styles.header}`}>
      {!["/", "/results"].includes(router.pathname) && (
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
      {router.pathname == "/results" && (
        <Link href="/">
          <a className={styles.logo}>reRoot</a>
        </Link>
      )}
    </header>
  );
};
export default Header;
