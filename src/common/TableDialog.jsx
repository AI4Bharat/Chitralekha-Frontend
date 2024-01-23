import React from "react";
import { themeDefault } from "theme";

//Components
import {
  Box,
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
  taskId,
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
          {taskId && (
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Task Id: {taskId}
            </Typography>
          )}
          <Typography variant="body1">{message}</Typography>

          {response && (
            <Box sx={{ mt: 3 }}>
              <ThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={response}
                  columns={columns}
                  options={options}
                />
              </ThemeProvider>
            </Box>
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
