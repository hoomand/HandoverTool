export const generateStyles = (theme, drawerWidth) => {
  return {
    root: {
      display: "flex",
      minHeight: "100vh"
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    app: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    },
    main: {
      flex: 1,
      padding: theme.spacing(6, 4),
      background: "#eaeff1"
    },
    footer: {
      padding: theme.spacing(2),
      background: "#eaeff1"
    }
  };
};

export const listStyles = theme => ({
  paper: {
    maxWidth: 936,
    margin: "auto",
    overflow: "hidden"
  },
  searchBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },
  searchInput: {
    fontSize: theme.typography.fontSize
  },
  block: {
    display: "block"
  },
  addRow: {
    marginRight: theme.spacing(1)
  },
  contentWrapper: {
    margin: "40px 16px"
  }
});
