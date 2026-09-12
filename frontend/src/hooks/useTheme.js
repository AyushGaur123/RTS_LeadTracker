import { useEffect } from "react";
import useThemeStore from "../store/themeStore";

const useTheme = () => {
  const {
    theme,
    toggleTheme,
    initializeTheme,
  } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return {
    theme,
    toggleTheme,
  };
};

export default useTheme;