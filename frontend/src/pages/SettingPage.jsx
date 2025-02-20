import { THEMES } from "../constant";
import { useThemeStore } from "../store/useThemeStore.js";



const ThemeButton = ({ theme, selectedTheme, onClick }) => (
  <button
    key={theme}
    className={`
      group flex flex-col items-center gap-2 p-3 rounded-lg transition-all
      ${
        selectedTheme === theme
          ? "bg-primary text-primary-content scale-105 shadow-md"
          : "hover:bg-base-200/50"
      }
    `}
    onClick={() => onClick(theme)}
    aria-label={`Select ${theme} theme`}
  >
    <div
      className="relative h-10 w-full rounded-md overflow-hidden shadow-sm"
      data-theme={theme}
    >
      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
        <div className="rounded bg-primary"></div>
        <div className="rounded bg-secondary"></div>
        <div className="rounded bg-accent"></div>
        <div className="rounded bg-neutral"></div>
      </div>
    </div>
    <span className="text-xs font-medium truncate w-full text-center">
      {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </span>
  </button>
);



const SettingPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-6 pt-20 max-w-4xl">
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {THEMES.map((t) => (
            <ThemeButton
              key={t}
              theme={t}
              selectedTheme={theme}
              onClick={setTheme}
            />
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default SettingPage;
