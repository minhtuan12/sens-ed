import { createTheme } from "@mui/material/styles";

import { colorSchemes, defaultSettings } from "@/lib/settings";
import type { LearnerSettings } from "@/types/sensed";

export function createSensedTheme(settings: LearnerSettings = defaultSettings) {
  const scheme = colorSchemes[settings.colorScheme];
  const scale = settings.fontScale;

  return createTheme({
    palette: {
      mode: scheme.background === "#000000" ? "dark" : "light",
      background: {
        default: scheme.background,
        paper: scheme.background
      },
      primary: {
        main: scheme.foreground,
        contrastText: scheme.background
      },
      text: {
        primary: scheme.foreground,
        secondary: scheme.foreground
      },
      divider: scheme.foreground
    },
    shape: {
      borderRadius: 8
    },
    typography: {
      fontFamily: "var(--font-atkinson), Atkinson Hyperlegible, Arial, sans-serif",
      h1: {
        fontSize: `${3.6 * scale}rem`,
        fontWeight: 800,
        lineHeight: 1.05
      },
      h2: {
        fontSize: `${2.8 * scale}rem`,
        fontWeight: 800,
        lineHeight: 1.1
      },
      h3: {
        fontSize: `${2.2 * scale}rem`,
        fontWeight: 800,
        lineHeight: 1.15
      },
      body1: {
        fontSize: `${1.5 * scale}rem`,
        lineHeight: 1.45
      },
      button: {
        fontSize: `${1.35 * scale}rem`,
        fontWeight: 800,
        textTransform: "none"
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box"
          },
          "html, body": {
            minHeight: "100%",
            background: scheme.background,
            color: scheme.foreground
          },
          body: {
            margin: 0
          },
          ":focus-visible": {
            outline: `4px solid ${scheme.focus}`,
            outlineOffset: "5px"
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 26,
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: scheme.foreground,
            minHeight: 72,
            paddingInline: 28
          }
        }
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined"
        },
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              borderRadius: 28,
              color: scheme.foreground,
              fontSize: `${1.4 * scale}rem`
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: scheme.foreground,
              borderWidth: 3
            },
            "& .MuiInputLabel-root": {
              color: scheme.foreground,
              fontSize: `${1.25 * scale}rem`
            }
          }
        }
      }
    }
  });
}
