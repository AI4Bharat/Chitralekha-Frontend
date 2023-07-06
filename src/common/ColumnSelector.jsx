import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { TableStyles } from "styles";

const ColumnSelector = ({
  open,
  anchorEl,
  handleClose,
  columns,
  handleColumnSelection,
}) => {
  const classes = TableStyles();

  const getCheckedStatus = (currentColumn) => {
    if (currentColumn.options.display === "true") {
      return true;
    }

    if (currentColumn.options.display === "false") {
      return false;
    }

    return false;
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Grid container className={classes.selectColumnContainer}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={classes.selectColumnGrid}
        >
          <Typography variant="h6" className={classes.selectColumnHeader}>
            Select Columns
          </Typography>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <FormGroup>
            {columns.map((item) => (
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={getCheckedStatus(item)}
                    disabled={!item.options.viewColumns}
                    onClick={(e) => handleColumnSelection(e)}
                  />
                }
                label={item.label}
                name={item.name}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>
    </Popover>
  );
};

export default ColumnSelector;
