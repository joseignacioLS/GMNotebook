import styles from "./spinner.module.scss";

interface IProps {
  color?: string;
}

const Spinner = ({ color }: IProps) => {
  return (
    <span
      className={`${styles.spinner} ${styles["material-symbols-outlined"]}`}
      style={{
        ...(color ? { color } : {}),
      }}
    >
      autorenew
    </span>
  );
};

export default Spinner;
