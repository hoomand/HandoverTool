import { red } from "@material-ui/core/colors";

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
  },
  card: {
    width: "100%",
    marginTop: 10
  },
  avatar: {
    backgroundColor: red[500]
  },
  badePadding: {
    padding: theme.spacing(0, 2)
  },
  badeMargin: {
    margin: theme.spacing(2)
  }
});

export const selectStyles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    minWidth: 120,
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});
