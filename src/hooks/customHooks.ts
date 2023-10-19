import { useEffect, useRef } from "react";

export const useUpdate = (
  callback: () => void,
  dependencies: any[],
  cleanUp: () => void
) => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = false;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      return callback();
    } else {
      isMounted.current = true;
    }
    return cleanUp;
  }, dependencies);
};
