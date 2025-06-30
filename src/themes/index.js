import { subwayTheme } from "./subway";
import { busTheme } from "./bus";

export const themes = {
  "nyc/mta/subway/r46": subwayTheme,
  "nyc/mta/bus": busTheme
};

// Function to get theme from URL path or default to 'MTA-R46-SUBWAY'
export const getCurrentTheme = (pathname) => {
  const path = pathname.replace("/", "");
  return themes[path] || themes["nyc/mta/subway/r46"];
};

// Function to get all available theme names
export const getAvailableThemes = () => Object.keys(themes);
