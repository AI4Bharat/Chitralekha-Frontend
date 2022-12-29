import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Styles
import DatasetStyle from "../../styles/Dataset";

//Components
import { Box, Card, Grid, Tab, Tabs } from "@mui/material";
import Button from "../../common/Button";
import UserList from "../Organization/UserList";
import CustomizedSnackbars from "../../common/Snackbar";
import OrganizationList from "./OrganizationList";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const DashBoard = () => {
  const classes = DatasetStyle();
  const navigate = useNavigate();

  const [value, setValue] = useState(0);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const renderSnackBar = () => {
    return (
      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={() =>
          setSnackbarInfo({ open: false, message: "", variant: "" })
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        variant={snackbar.variant}
        message={snackbar.message}
      />
    );
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      {renderSnackBar()}
      <Card className={classes.workspaceCard}>
        <Box>
          <Tabs
            value={value}
            onChange={(_event, newValue) => setValue(newValue)}
            aria-label="basic tabs example"
          >
            <Tab
              label={"Organizations"}
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
            <Tab label={"Members"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab label={"Settings"} sx={{ fontSize: 16, fontWeight: "700" }} />
          </Tabs>
        </Box>

        <TabPanel
          value={value}
          index={0}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              className={classes.projectButton}
              label={"Add New Organization"}
              onClick={() => navigate(`/admin/create-new-org`)}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <OrganizationList />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={1}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              className={classes.projectButton}
              label={"Add New Member"}
            />
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <UserList data={[]} />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={2}
          style={{ textAlign: "center", maxWidth: "100%" }}
        ></TabPanel>
      </Card>
    </Grid>
  );
};

export default DashBoard;
