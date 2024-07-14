import { useContext } from "react";
import { DataContext } from "@/context/data";

import styles from "./spoiler.module.scss";

interface IProps {
  id: string;
  text: string;
  wrapped: boolean;
}
const Spoiler = ({ text, id, wrapped }: IProps) => {
  const { canEdit } = useContext(DataContext);
  return (
    <span
      id={id}
      className={`${styles.spoiler} ${!canEdit && "noEdit"} text ${
        !wrapped && "paragraph"
      }`}
    >
      {text}
    </span>
  );
};

export default Spoiler;
