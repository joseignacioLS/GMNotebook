import styles from "./listitem.module.scss";

interface IProps {
  id: string;
  wrapped: boolean;
  content: string;
}
const ListItem = ({ id, wrapped, content }: IProps) => {
  return (
    <span className={`${styles.listItem}  text ${!wrapped && "paragraph"}`}>
      {content}
    </span>
  );
};

export default ListItem;
