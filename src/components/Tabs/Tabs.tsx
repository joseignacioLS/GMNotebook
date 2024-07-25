import { useContext } from "react";
import styles from "./tabs.module.scss";
import { DataContext } from "@/context/data";
import { NavigationContext } from "@/context/navigation";
import { colorContext } from "@/context/colors";

export const Tabs = () => {
  const { data, updateSelectedNote } = useContext(DataContext);
  const { navigateTo, currentPage } = useContext(NavigationContext);
  const { generateColor } = useContext(colorContext);
  const tabs: { name: string; route: string }[] = [];
  Object.values(data).forEach((value) => {
    if (value.showInTabs) {
      tabs.push({ name: value.title || "Home", route: value.key });
    }
  });

  const handleNavigate = (route: string) => {
    updateSelectedNote(route);
    navigateTo(route);
  };

  return (
    <section className={styles.tabs}>
      {tabs.map(({ name, route }) => {
        const isActive = currentPage === route;
        const [backgroundColor, color] = generateColor(route);
        return (
          <span
            key={name}
            onClick={() => !isActive && handleNavigate(route)}
            className={`${styles.tab} ${isActive && styles.active}`}
            style={{
              backgroundColor,
              color,
            }}
          >
            {name}
          </span>
        );
      })}
    </section>
  );
};
