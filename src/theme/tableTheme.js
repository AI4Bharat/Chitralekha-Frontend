import themeDefault from "./theme";
import { createTheme } from "@mui/material/styles";

const tableTheme = createTheme({
  ...themeDefault,
  components: {
    ...themeDefault.components,
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "25",
          borderRadius: "none",
          textTransform: "none",
        },
        label: {
          textTransform: "none",
          fontFamily: '"Roboto", "Segoe UI"',
          fontSize: "16px",
          letterSpacing: "0.16px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          height: "19px",
          "@media (max-width:640px)": {
            fontSize: "10px",
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          maxHeight: "30%",
        },
      },
    },
    MUIDataTableToolbar: {
      styleOverrides: {
        left: {
          width: "fit-content",
          flex: "none"
        },
        root:{
          height:"30px"
        }
      },
    },
    MUIDataTableFilter: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          width: "80%",
          fontFamily: '"Roboto" ,sans-serif',
        },
        checkboxFormControl: {
          minWidth: "120px",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MUIDataTableSelectCell: {
      styleOverrides: {
        checkboxRoot: {
          margin: "auto",
        },
        fixedLeft: {
          position: "static",
        },
      },
    },
    MUIDataTableSearch: {
      styleOverrides: {
        searchText: {
         width:"400px"
         
        },
        searchIcon:{
          marginRight:"-6px"
        },
        
      },
    },
  },
});

export default tableTheme;
