import styles from "./page.module.scss";
import PageDisplay from "./PageDisplay";

const Page = ({}) => {
  return (
    <div className={`${styles.pageContainer}`}>
      <PageDisplay />
    </div>
  );
};

export default Page;
