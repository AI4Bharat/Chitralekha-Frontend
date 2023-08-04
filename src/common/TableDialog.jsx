import React from "react";
import { themeDefault } from "theme";

//Components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import MUIDataTable from "mui-datatables";

const TableDialog = ({
  openDialog,
  handleClose,
  message,
  response,
  columns,
}) => {
  const options = {
    pagination: false,
    fixedHeader: false,
    download: false,
    print: false,
    filter: false,
    viewColumns: false,
    search: false,
    sort: false,
    selectableRows: "none",
  };

  const getMuiTheme = () =>
    createTheme({
      ...themeDefault,
      components: {
        ...themeDefault.components,
        MuiTableRow: {
          styleOverrides: {
            root: {
              backgroundColor: "rgba(254, 191, 44, 0.1)",
            },
          },
        },
      },
    });

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      maxWidth={"md"}
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1" sx={{ mb: 3 }}>
            {message}
          </Typography>

          {response && (
            <ThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={response}
                columns={columns}
                options={options}
              />
            </ThemeProvider>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: "0 20px 20px 20px" }}>
        <Button
          variant="text"
          onClick={handleClose}
          sx={{ lineHeight: "1", borderRadius: "6px" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableDialog;
