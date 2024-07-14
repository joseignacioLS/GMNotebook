import styles from "./title.module.scss";
interface IProps {
  id: string;
  wrapped: boolean;
  content: string;
  subtitle?: boolean;
}

const Title = ({ id, wrapped, content, subtitle = false }: IProps) => {
  return (
    <span
      key={id}
      id={id}
      className={`${subtitle ? styles.subtitle : styles.title}  text ${
        !wrapped && "paragraph"
      }`}
    >
      {content}
    </span>
  );
};

export default Title;
