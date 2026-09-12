import { create } from "zustand";

const getInitialTheme = () => {
  const saved =
    localStorage.getItem(
      "leadflow_theme"
    );

  if (saved) {
    return saved;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    set((state) => {
      const newTheme =
        state.theme === "dark"
          ? "light"
          : "dark";

      localStorage.setItem(
        "leadflow_theme",
        newTheme
      );

      document.documentElement.classList.toggle(
        "dark",
        newTheme === "dark"
      );

      return {
        theme: newTheme,
      };
    });
  },

  initializeTheme: () => {
    const theme = getInitialTheme();

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    set({ theme });
  },
}));

export default useThemeStore;