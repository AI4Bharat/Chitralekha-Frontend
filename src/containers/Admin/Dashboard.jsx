import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

//styles
import { DatasetStyle } from "styles";

//Components
import { Box, Card, Grid, Tab, Tabs, Button } from "@mui/material";
import OrganizationList from "./OrganizationList";
import MemberList from "./MemberList";
import { AddNewMember, AddOrganizationMember } from "common";
import AdminLevelReport from "./AdminLevelReport";

//Apis
import { APITransport, AddOrganizationMemberAPI } from "redux/actions";
import NewsLetter from "./NewsLetterTemplate";

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
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  const addNewMemberHandler = async () => {
    const data = {
      role: "ORG_OWNER",
      emails: newMemberEmail,
    };

    const apiObj = new AddOrganizationMemberAPI(data);
    dispatch(APITransport(apiObj));

    setNewMemberEmail("");
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
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
            <Tab label={"Reports"} sx={{ fontSize: 16, fontWeight: "700" }} />
            <Tab
              label={"Newsletter"}
              sx={{ fontSize: 16, fontWeight: "700" }}
            />
          </Tabs>
        </Box>

        <TabPanel
          value={value}
          index={0}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Grid container direction="row" sx={{ my: 4 }}>
            <Grid item md={6} xs={12}>
              <Button
                style={{ marginRight: "10px", width: "100%" }}
                variant="contained"
                onClick={() => navigate(`/admin/create-new-org`)}
              >
                Add New Organization
              </Button>
            </Grid>

            <Grid item md={6} xs={12}>
              <Button
                style={{ marginLeft: "10px", width: "100%" }}
                variant="contained"
                onClick={() => setOpenMemberDialog(true)}
              >
                Create New Members
              </Button>
            </Grid>

            <Grid item md={12} xs={12} style={{ width: "100%" }}>
              <div
                className={classes.workspaceTables}
                style={{ width: "100%" }}
              >
                <OrganizationList />
              </div>
            </Grid>
          </Grid>
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
              onClick={() => setAddUserDialog(true)}
              variant="contained"
            >
              Add New Member
            </Button>

            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <MemberList />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={2}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <AdminLevelReport />
            </div>
          </Box>
        </TabPanel>

        <TabPanel
          value={value}
          index={3}
          style={{ textAlign: "center", maxWidth: "100%" }}
        >
          <Box
            display={"flex"}
            flexDirection="Column"
            justifyContent="center"
            alignItems="center"
          >
            <div className={classes.workspaceTables} style={{ width: "100%" }}>
              <NewsLetter />
            </div>
          </Box>
        </TabPanel>
      </Card>

      {addUserDialog && (
        <AddOrganizationMember
          open={addUserDialog}
          handleUserDialogClose={() => {
            setAddUserDialog(false);
            setNewMemberEmail("");
          }}
          title={"Add New Members"}
          textFieldLabel={"Enter Email Id of Member"}
          textFieldValue={newMemberEmail}
          handleTextField={setNewMemberEmail}
          addBtnClickHandler={addNewMemberHandler}
          isAdmin={true}
        />
      )}

      {openMemberDialog && (
        <AddNewMember
          open={openMemberDialog}
          handleClose={() => setOpenMemberDialog(false)}
        />
      )}
    </Grid>
  );
};

export default DashBoard;
