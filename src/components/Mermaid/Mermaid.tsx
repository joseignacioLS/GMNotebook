"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

interface IProps {
  diagram: string;
}

mermaid.initialize({
  startOnLoad: true,
  themeVariables: {
    lineColor: "#AAA",
    primaryColor: "#F00",
  },
  securityLevel: "loose",
  fontFamily: "Fira Code",
});

const Mermaid: React.FC<IProps> = ({ diagram }) => {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return (
    <div suppressHydrationWarning className="mermaid">
      {diagram}
    </div>
  );
};

export default Mermaid;
