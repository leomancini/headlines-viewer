# Headlines Themes

This application now supports multiple themes that can be accessed via URL paths.

## Available Themes

### 1. Subway (Default)

- **URL**: `/subway` or `/`
- **Style**: Classic NYC subway display with yellow text on dark background
- **Font**: NYCTA-R46 (subway font)
- **Colors**: Yellow text, dark green background, beige wall

### 2. Bus

- **URL**: `/bus`
- **Style**: Traditional newspaper look with serif fonts
- **Font**: Times New Roman
- **Colors**: Dark text on cream background, brown accents

## How to Use Themes

### Via URL Paths

Navigate to the theme-specific URL:

- `http://localhost:3000/subway` (default)
- `http://localhost:3000/bus`

### Combining with Scale

You can combine themes with the scale parameter:

- `http://localhost:3000/subway?scale=1.5`
- `http://localhost:3000/bus?scale=0.8`

## Adding New Themes

To add a new theme:

1. Create a new file in `src/themes/` (e.g., `src/themes/dark.js`)
2. Export a theme object with all required styled components:

```javascript
import styled from "styled-components";

// Include scale functions
const getScaleFactor = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const scale = urlParams.get("scale");
  return scale ? parseFloat(scale) : 1;
};

const scale = (value) => {
  const scaleFactor = getScaleFactor();
  return value * scaleFactor;
};

export const darkTheme = {
  name: "dark",
  Container: styled.div`...`,
  Wall: styled.div`...`,
  ScreenContainer: styled.div`...`,
  Screen: styled.div`...`,
  TextContainer: styled.div`...`,
  TextAndMetadata: styled.div`...`,
  TitleWrapper: styled.div`...`,
  LoadingText: styled.div`...`,
  ErrorText: styled.div`...`,
  Text: styled.div`...`,
  Metadata: styled.div`...`,
  Description: styled.div`...`,
  ProgressBar: styled.div`...`,
  ProgressFill: styled.div`...`
};
```

3. Import and add the theme to `src/themes/index.js`:

```javascript
import { darkTheme } from "./dark";

export const themes = {
  subway: subwayTheme,
  bus: classicTheme,
  dark: darkTheme // Add your new theme here
};
```

4. Add the route to `src/index.js`:

```javascript
<Route path="/dark" element={<App />} />
```

## Theme Component Structure

Each theme must include these styled components:

- **Container**: Main app container
- **Wall**: Background wall/container
- **ScreenContainer**: Outer screen frame
- **Screen**: Inner screen area
- **TextContainer**: Text display area
- **TextAndMetadata**: Layout container for text and metadata
- **TitleWrapper**: Container for headline text
- **LoadingText**: Loading state text
- **ErrorText**: Error state text
- **Text**: Individual headline text lines
- **Metadata**: Bottom metadata area
- **Description**: Time/date text
- **ProgressBar**: Progress bar container
- **ProgressFill**: Progress bar fill

## Scale Support

All themes automatically support the `scale` URL parameter for responsive sizing. The `scale()` function should be used for all size-related CSS properties to ensure proper scaling.
