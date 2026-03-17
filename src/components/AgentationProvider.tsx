"use client";

import { Agentation } from "agentation";
import { useEffect, useState } from "react";

export function AgentationProvider() {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsDev(true);
    }
  }, []);

  if (!isDev) return null;

  return <Agentation />;
}
