const colors = {
  TEXT_PRIMARY: /*"#343434"*/ "white",
  TEXT_SECONDARY: "#979799",
  DARKEST_PURPLE: "#0C0032",
  DARK_PURPLE: "#190061",
  PURPLE: "#240090",
  LIGHT_PURPLE: "#3500D3",
  DARK_GREY: "#282828",
};

const fonts = {
  FONT_SIZE_XSMALL: 12,
  FONT_SIZE_SMALL: 15,
  FONT_SIZE_BASE: 17,
  FONT_SIZE_LARGE: 20,
  FONT_SIZE_XLARGE: 40,
  FONT_BOLD: "Helvetica-Bold",
  FONT_REGULAR: "Helvetica",
};

const appStyle = {
  colors,

  centered: {
    textAlign: "justify",
    width: "66%",
    margin: "auto",
  },

  fullWidth: {
    paddingTop: 10,
    width: "100%",
    backgroundColor: colors.PURPLE,
  },

  title: {
    fontFamily: fonts.FONT_BOLD,
    fontSize: fonts.FONT_SIZE_XLARGE,
    color: colors.TEXT_PRIMARY,
    paddingLeft: "10px",
    marginBottom: 0,
  },

  subtitle: {
    fontFamily: fonts.FONT_REGULAR,
    fontSize: fonts.FONT_SIZE_XSMALL,
    color: colors.TEXT_SECONDARY,
    paddingLeft: "10px",
    marginTop: 5,
  },

  sectionTitle: {
    fontFamily: fonts.FONT_BOLD,
    fontSize: fonts.FONT_SIZE_LARGE,
    color: colors.TEXT_PRIMARY,
    paddingLeft: "10px",
    padding: 0,
    marginTop: 20,
    marginBottom: 20,
  },

  paragraph: {
    fontFamily: fonts.FONT_REGULAR,
    fontSize: fonts.FONT_SIZE_BASE,
    color: colors.TEXT_PRIMARY,
    padding: "10px",
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },

  flexboxRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  
  hidden: {
    opacity: 0,
    position: "absolute",
  },
  
  shadow: {
    boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.25)",
  },

  background: {
    backgroundColor: colors.DARKEST_PURPLE,
    width: "100%",
    height: "100%",
    minWidth: "100%",
    minHeight: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    overflowY: "scroll",
  },

  video: {
    maxWidth: 2000,
    maxHeight: 500,
  },
};

export default appStyle;