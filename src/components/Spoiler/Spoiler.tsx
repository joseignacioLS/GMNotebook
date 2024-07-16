import { useContext, useState } from "react";
import { DataContext } from "@/context/data";

import styles from "./spoiler.module.scss";

interface IProps {
  id: string;
  text: string;
  wrapped: boolean;
}
const Spoiler = ({ text, id, wrapped }: IProps) => {
  const [show, setShow] = useState(false);
  const { canEdit, editMode } = useContext(DataContext);

  const handleShow = () => {
    if (!canEdit) return;
    setShow(true);
  };

  return (
    <span
      id={id}
      className={`${styles.spoiler} text ${!wrapped && "paragraph"}`}
      onMouseLeave={() => setShow(false)}
    >
      {text}
      <div
        className={`${styles.cover} ${editMode && styles.preview} ${
          !canEdit && styles.notUncovereable
        } ${show && styles.show}`}
      >
        <span
          className={styles["material-symbols-outlined"]}
          onClick={handleShow}
        >
          visibility_off
        </span>
      </div>
    </span>
  );
};

export default Spoiler;
