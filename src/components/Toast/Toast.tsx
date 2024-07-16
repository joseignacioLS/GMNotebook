import { useContext } from "react";
import styles from "./toast.module.scss";
import { EToastType, toastContext } from "@/context/toast";

const customStyles = {
  [EToastType.SUCCESS]: styles.success,
  [EToastType.ERROR]: styles.error,
};

const Toast = () => {
  const { text, type } = useContext(toastContext);
  if (text === "") return <></>;
  return (
    <div
      className={`${styles.toast} ${text && styles.visible} ${
        customStyles[type]
      }`}
    >
      {text}
    </div>
  );
};

export default Toast;
