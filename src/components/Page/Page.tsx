import styles from "./page.module.scss";
import PageEdit from "./PageEdit";
import PageDisplay from "./PageDisplay";

const Page = ({}) => {
  return (
    <div className={`${styles.pageContainer}`}>
      <PageDisplay />
      <PageEdit />
    </div>
  );
};

export default Page;
