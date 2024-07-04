import { useContext } from "react";
import styles from "./image.module.scss";
import { modalContext } from "@/context/modal";

interface IProps {
  src: string;
  fullSize?: boolean;
  canDetail?: boolean;
}

const Image: React.FC<IProps> = ({ src, fullSize, canDetail = true }) => {
  const { setContent } = useContext(modalContext);
  const handleImageClick = () => {
    setContent(<Image src={src} fullSize canDetail={false} />);
  };
  return (
    <img
      className={`${styles.img} ${fullSize && styles.fullSize}`}
      onClick={handleImageClick}
      src={src}
      style={{ cursor: canDetail ? "pointer" : "default" }}
    />
  );
};

export default Image;
