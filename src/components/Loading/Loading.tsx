import { useContext } from "react";
import styles from "./loading.module.scss";
import { loadingContext } from "@/context/loading";

const Loading = () => {
  const { show } = useContext(loadingContext);
  if (!show) return <></>;
  return (
    <div className={styles.wrapper}>
      <span className={styles["material-symbols-outlined"]}>autorenew</span>
    </div>
  );
};

export default Loading;
