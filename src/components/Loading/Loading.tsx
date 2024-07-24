import { useContext } from "react";
import styles from "./loading.module.scss";
import { loadingContext } from "@/context/loading";
import Spinner from "../Spinner/Spinner";

const Loading = () => {
  const { show } = useContext(loadingContext);
  if (!show) return <></>;
  return (
    <div className={styles.wrapper}>
      <Spinner />
    </div>
  );
};

export default Loading;
