import {
  Moon,
  Sun,
} from "lucide-react";

import useTheme from "../../hooks/useTheme";

function ThemeToggle() {
  const {
    theme,
    toggleTheme,
  } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex h-10 w-10 items-center
        justify-center rounded-xl
        border border-slate-200
        bg-white text-slate-700
        transition hover:bg-slate-100
        dark:border-slate-700
        dark:bg-slate-900
        dark:text-slate-200
        dark:hover:bg-slate-800
      "
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={19} />
      ) : (
        <Moon size={19} />
      )}
    </button>
  );
}

export default ThemeToggle;