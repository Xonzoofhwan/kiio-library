import { primitive } from './primitive';

interface SemanticColorScale {
  50:  string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface SemanticNeutralScale {
  0:   string;
  50:  string;
  70:  string;
  100: string;
  200: string;
  300: string;
  400: string;
  600: string;
  800: string;
  950: string;
}

interface SemanticBackgroundScale {
  0:  string;
  50: string;
  70: string;
}

interface SemanticDividerScale {
  50:  string;
  70:  string;
  100: string;
  200: string;
  300: string;
}

interface SemanticTextScale {
  400: string;
  600: string;
  800: string;
  900: string;
  950: string;
}

interface SemanticStateScale {
  50:  string;
  70:  string;
  100: string;
}

export interface SemanticTheme {
  Primary:    SemanticColorScale;
  Success:    SemanticColorScale;
  Warning:    SemanticColorScale;
  Error:      SemanticColorScale;
  Neutral: {
    Solid:      SemanticNeutralScale;
    BlackAlpha: SemanticNeutralScale;
    WhiteAlpha: SemanticNeutralScale;
  };
  Background: SemanticBackgroundScale;
  Divider: {
    Solid: SemanticDividerScale;
    Alpha: SemanticDividerScale;
  };
  Text: {
    OnBright: SemanticTextScale;
    OnDim:    SemanticTextScale;
  };
  State: {
    OnBright: SemanticStateScale;
    OnDim:    SemanticStateScale;
  };
}

export interface SemanticTokens {
  light: SemanticTheme;
  dark: SemanticTheme;
}

const neutralSolid: SemanticNeutralScale = {
  0:   primitive.Gray[0],
  50:  primitive.Gray[50],
  70:  primitive.Gray[70],
  100: primitive.Gray[100],
  200: primitive.Gray[200],
  300: primitive.Gray[300],
  400: primitive.Gray[400],
  600: primitive.Gray[600],
  800: primitive.Gray[800],
  950: primitive.Gray[950],
};

const neutralBlackAlpha: SemanticNeutralScale = {
  0:   primitive.BlackAlpha[0],
  50:  primitive.BlackAlpha[50],
  70:  primitive.BlackAlpha[70],
  100: primitive.BlackAlpha[100],
  200: primitive.BlackAlpha[200],
  300: primitive.BlackAlpha[300],
  400: primitive.BlackAlpha[400],
  600: primitive.BlackAlpha[600],
  800: primitive.BlackAlpha[800],
  950: primitive.BlackAlpha[950],
};

const neutralWhiteAlpha: SemanticNeutralScale = {
  0:   primitive.WhiteAlpha[0],
  50:  primitive.WhiteAlpha[50],
  70:  primitive.WhiteAlpha[70],
  100: primitive.WhiteAlpha[100],
  200: primitive.WhiteAlpha[200],
  300: primitive.WhiteAlpha[300],
  400: primitive.WhiteAlpha[400],
  600: primitive.WhiteAlpha[600],
  800: primitive.WhiteAlpha[800],
  950: primitive.WhiteAlpha[950],
};

const background: SemanticBackgroundScale = {
  0:  primitive.Gray[0],
  50: primitive.Gray[50],
  70: primitive.Gray[70],
};

const dividerSolid: SemanticDividerScale = {
  50:  primitive.Gray[50],
  70:  primitive.Gray[70],
  100: primitive.Gray[100],
  200: primitive.Gray[200],
  300: primitive.Gray[300],
};

const dividerAlpha: SemanticDividerScale = {
  50:  primitive.BlackAlpha[50],
  70:  primitive.BlackAlpha[70],
  100: primitive.BlackAlpha[100],
  200: primitive.BlackAlpha[200],
  300: primitive.BlackAlpha[300],
};

const textOnBright: SemanticTextScale = {
  400: primitive.BlackAlpha[400],
  600: primitive.BlackAlpha[600],
  800: primitive.BlackAlpha[800],
  900: primitive.BlackAlpha[900],
  950: primitive.BlackAlpha[950],
};

const textOnDim: SemanticTextScale = {
  400: primitive.WhiteAlpha[500], // offset: 400 → WhiteAlpha.500
  600: primitive.WhiteAlpha[700], // offset: 600 → WhiteAlpha.700
  800: primitive.WhiteAlpha[900],
  900: primitive.WhiteAlpha[950],
  950: primitive.WhiteAlpha[1000],
};

const stateOnBright: SemanticStateScale = {
  50:  primitive.BlackAlpha[50],
  70:  primitive.BlackAlpha[70],
  100: primitive.BlackAlpha[100],
};

const stateOnDim: SemanticStateScale = {
  50:  primitive.WhiteAlpha[70],  // offset: 50 → WhiteAlpha.70
  70:  primitive.WhiteAlpha[100],
  100: primitive.WhiteAlpha[200],
};

export const semantic: SemanticTokens = {
  light: {
    Primary: {
      50:  primitive.Purple[50],
      100: primitive.Purple[100],
      200: primitive.Purple[200],
      300: primitive.Purple[300],
      400: primitive.Purple[400],
      500: primitive.Purple[500],
      600: primitive.Purple[600],
      700: primitive.Purple[700],
      800: primitive.Purple[800],
      900: primitive.Purple[900],
    },
    Success: {
      50:  primitive.Forest[50],
      100: primitive.Forest[100],
      200: primitive.Forest[200],
      300: primitive.Forest[300],
      400: primitive.Forest[400],
      500: primitive.Forest[500],
      600: primitive.Forest[600],
      700: primitive.Forest[700],
      800: primitive.Forest[800],
      900: primitive.Forest[900],
    },
    Warning: {
      50:  primitive.Amber[50],
      100: primitive.Amber[100],
      200: primitive.Amber[200],
      300: primitive.Amber[300],
      400: primitive.Amber[400],
      500: primitive.Amber[500],
      600: primitive.Amber[700], // offset: 600 → Amber.700
      700: primitive.Amber[800],
      800: primitive.Amber[900],
      900: primitive.Amber[950],
    },
    Error: {
      50:  primitive.RedBright[50],
      100: primitive.RedBright[100],
      200: primitive.RedBright[200],
      300: primitive.RedBright[300],
      400: primitive.RedBright[400],
      500: primitive.RedBright[500],
      600: primitive.RedBright[600],
      700: primitive.RedBright[700],
      800: primitive.RedBright[800],
      900: primitive.RedBright[950], // offset: 900 → RedBright.950
    },
    Neutral:    { Solid: neutralSolid, BlackAlpha: neutralBlackAlpha, WhiteAlpha: neutralWhiteAlpha },
    Background: background,
    Divider:    { Solid: dividerSolid, Alpha: dividerAlpha },
    Text:       { OnBright: textOnBright, OnDim: textOnDim },
    State:      { OnBright: stateOnBright, OnDim: stateOnDim },
  },

  dark: {
    // Accent colors — same as light
    Primary: {
      50:  primitive.Purple[50],
      100: primitive.Purple[100],
      200: primitive.Purple[200],
      300: primitive.Purple[300],
      400: primitive.Purple[400],
      500: primitive.Purple[500],
      600: primitive.Purple[600],
      700: primitive.Purple[700],
      800: primitive.Purple[800],
      900: primitive.Purple[900],
    },
    Success: {
      50:  primitive.Forest[50],
      100: primitive.Forest[100],
      200: primitive.Forest[200],
      300: primitive.Forest[300],
      400: primitive.Forest[400],
      500: primitive.Forest[500],
      600: primitive.Forest[600],
      700: primitive.Forest[700],
      800: primitive.Forest[800],
      900: primitive.Forest[900],
    },
    Warning: {
      50:  primitive.Amber[50],
      100: primitive.Amber[100],
      200: primitive.Amber[200],
      300: primitive.Amber[300],
      400: primitive.Amber[400],
      500: primitive.Amber[500],
      600: primitive.Amber[700], // offset: 600 → Amber.700
      700: primitive.Amber[800],
      800: primitive.Amber[900],
      900: primitive.Amber[950],
    },
    Error: {
      50:  primitive.RedBright[50],
      100: primitive.RedBright[100],
      200: primitive.RedBright[200],
      300: primitive.RedBright[300],
      400: primitive.RedBright[400],
      500: primitive.RedBright[500],
      600: primitive.RedBright[600],
      700: primitive.RedBright[700],
      800: primitive.RedBright[800],
      900: primitive.RedBright[950], // offset: 900 → RedBright.950
    },
    // Dark surfaces — reversed gray, swapped alpha
    Neutral: {
      Solid: {
        0:   primitive.Gray[950],
        50:  primitive.Gray[900],
        70:  primitive.Gray[800],
        100: primitive.Gray[700],
        200: primitive.Gray[600],
        300: primitive.Gray[500],
        400: primitive.Gray[400],
        600: primitive.Gray[200],
        800: primitive.Gray[70],
        950: primitive.Gray[0],
      },
      BlackAlpha: neutralWhiteAlpha,  // swap: light-on-dark
      WhiteAlpha: neutralBlackAlpha,  // swap: dark-on-dark
    },
    Background: {
      0:  primitive.Gray[950],
      50: primitive.Gray[900],
      70: primitive.Gray[800],
    },
    Divider: {
      Solid: {
        50:  primitive.Gray[800],
        70:  primitive.Gray[700],
        100: primitive.Gray[600],
        200: primitive.Gray[500],
        300: primitive.Gray[400],
      },
      Alpha: dividerAlpha, // white-alpha handled via CSS; TS keeps same structure
    },
    Text: {
      OnBright: textOnDim,   // swap: light text on dark bg
      OnDim:    textOnBright, // swap: dark text on light accent
    },
    State: {
      OnBright: stateOnDim,   // swap: light hover on dark bg
      OnDim:    stateOnBright, // swap: dark hover on light accent
    },
  },
};
