"use client";

import { useCallback, useState } from "react";
import { useWebHaptics } from "./use-web-haptics";

/** Copies text to the clipboard; `done` stays true for a moment so the button can confirm it */
export function useCopy(text: string) {
  const [done, setDone] = useState(false);
  const { trigger } = useWebHaptics();

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      trigger("success");
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      // The clipboard can be blocked; the text stays visible on the button
    }
  }, [text, trigger]);

  return { copy, done };
}
