import styles from "./quote.module.scss";

interface IProps {
  id: string;
  content: string;
  wrapped: boolean;
}
const Quote = ({ id, content, wrapped }: IProps) => {
  return (
    <span
      key={id}
      className={`${styles.quote} text ${!wrapped && "paragraph"}`}
    >
      {content}
    </span>
  );
};

export default Quote;
