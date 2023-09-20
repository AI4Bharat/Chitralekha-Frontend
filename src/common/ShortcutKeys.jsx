import React, { useEffect, useCallback } from "react";

const ShortcutKeys = ({ shortcuts }) => {
  const handleKeyPress = useCallback(
    (e) => {
      shortcuts.forEach((shortcut) => {
        const { keys, callback } = shortcut;
        if (
          keys.every((key) => {
            if (key === "Control") return e.ctrlKey;
            if (key === "Shift") return e.shiftKey;
            if (key === "Alt") return e.altKey;
            return e.key === key;
          })
        ) {
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.preventDefault();
          callback();
        }
      });
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null;
};

export default ShortcutKeys;