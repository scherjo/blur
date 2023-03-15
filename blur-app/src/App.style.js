const colors = {
  TEXT_PRIMARY: "#343434",
  TEXT_SECONDARY: "#979799",
  DARKEST_PURPLE: "#0C0032",
  DARK_PURPLE: "#190061",
  PURPLE: "#240090",
  LIGHT_PURPLE: "#3500D3",
  DARK_GREY: "#282828",
  BACKGROUND: "rgba(235, 219, 210, 1)",
};

const fonts = {
  FONT_SIZE_XSMALL: 12,
  FONT_SIZE_SMALL: 15,
  FONT_SIZE_BASE: 17,
  FONT_SIZE_LARGE: 20,
  FONT_SIZE_XLARGE: 40,
  FONT_BOLD: "Helvetica-Bold",
  FONT_REGULAR: "Helvetica-Regular",
};

const appStyle = {
  colors,

  title: {
    fontFamily: fonts.FONT_BOLD,
    fontSize: fonts.FONT_SIZE_XLARGE,
    color: colors.TEXT_PRIMARY,
  },

  flexboxRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  
  hidden: {
    opacity: 0,
    position: "absolute",
  },
  
  shadow: {
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.25)",
  },

  background: {
    backgroundColor: colors.BACKGROUND,
    width: "100%",
    height: "100%",
    minWidth: "100%",
    minHeight: "100%",
    position: "fixed",
    top: 0,
    left: 0,
  }
  
};

export default appStyle;