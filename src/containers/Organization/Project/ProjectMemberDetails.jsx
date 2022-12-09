import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { roles } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";

//Themes
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import CustomButton from "../../../common/Button";
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/system";
import CustomizedSnackbars from "../../../common/Snackbar"

//APIs
import RemoveProjectMemberAPI from "../../../redux/actions/api/Project/RemoveProjectMember";
import APITransport from "../../../redux/actions/apitransport/apitransport";
import FetchProjectMembersAPI from "../../../redux/actions/api/Project/FetchProjectMembers";

const ProjectMemberDetails = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);
  const [snackbar, setSnackbarInfo] = useState({
    open: false,
    message: "",
    variant: "success",
  });

  const projectMembersList = useSelector(
    (state) => state.getProjectMembers.data
  );
  console.log(projectMembersList,"projectMembersList")

  const removeProjectMember = async(id) => {
    const apiObj = new RemoveProjectMemberAPI(projectId, id);
    //dispatch(APITransport(apiObj));
    const res = await fetch(apiObj.apiEndPoint(), {
      method: "POST",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    });
    const resp = await res.json();
    if (res.ok) {
      setSnackbarInfo({
        open: true,
        message:  resp?.message,
        variant: "success",
      })
      getProjectMembers();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      })
    }
  };

  const getProjectMembers = () => {
    const userObj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectMembers();
  }, []);

  useEffect(() => {
    const result = projectMembersList.map((item) => {
      return [
        `${item.first_name} ${item.last_name}`,
        item.username,
        item.email,
        item.availability_status,
        roles.map((value) => (value.id === item.role ? value.type : "")),
        <Box>
          <Link to={`/profile/${item.id}`} style={{ textDecoration: "none" }}>
            <CustomButton
              sx={{ borderRadius: 2, marginRight: 1 }}
              label="View"
            />
          </Link>
          <CustomButton
            sx={{ borderRadius: 2 }}
            label="Remove"
            color="error"
            onClick={() => removeProjectMember(item.id)}
          />
        </Box>,
      ];
    });

    setTableData(result);
  }, [projectMembersList]);

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "username",
      label: "Username",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "availability_status",
      label: "Availability Status",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "role",
      label: "Role",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

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
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={tableData} columns={columns} options={options} />
      </ThemeProvider>
      {renderSnackBar()}
    </>
  );
};

export default ProjectMemberDetails;
