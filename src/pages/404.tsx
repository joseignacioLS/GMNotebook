import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, []);
  return <div>404</div>;
};

export default Home;
