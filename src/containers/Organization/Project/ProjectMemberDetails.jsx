import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { roles } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";

//Themes
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import tableTheme from "../../../theme/tableTheme";

//Components
import CustomButton from "../../../common/Button";
import MUIDataTable from "mui-datatables";
import { Box } from "@mui/system";
import CustomizedSnackbars from "../../../common/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import Search from "../../../common/Search";

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

  const SearchProject = useSelector((state) => state.searchList.data);

  const removeProjectMember = async (id) => {
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
        message: resp?.message,
        variant: "success",
      });
      getProjectMembers();
    } else {
      setSnackbarInfo({
        open: true,
        message: resp?.message,
        variant: "error",
      });
    }
  };

  const getProjectMembers = () => {
    const userObj = new FetchProjectMembersAPI(projectId);
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getProjectMembers();
  }, []);

  // useEffect(() => {
  //   const result = projectMembersList.map((item) => {

  const pageSearch = () => {
    return projectMembersList.filter((el) => {
      if (SearchProject == "") {
        return el;
      } else if (
        el.username?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.email?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      } else if (
        el.first_name?.toLowerCase().includes(SearchProject?.toLowerCase())
      ) {
        return el;
      }
    });
  };
  const result =
    projectMembersList && projectMembersList.length > 0
      ? pageSearch().map((item, i) => {
          return [
            `${item.first_name} ${item.last_name}`,
            item.username,
            item.email,
            item.role,
            // item.availability_status,
            //roles.map((value) => (value.id === item.role ? value.type : "")),
            <Box sx={{ display: "flex" }}>
              <Tooltip title="View">
                <IconButton>
                  <Link
                    to={`/profile/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <PreviewIcon color="primary" sx={{ mt: "10px" }} />
                  </Link>
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton>
                  <DeleteIcon
                    color="error"
                    onClick={() => removeProjectMember(item.id)}
                  />
                </IconButton>
              </Tooltip>
            </Box>,
          ];
        })
      : [];

  //   setTableData(result);
  // }, [projectMembersList]);

  const columns = [
    {
      name: "name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({
          style: { textAlign: "center"},
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
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: {
            height: "30px",
            fontSize: "16px",
            padding: "16px",
            textAlign: "center",
          },
        }),
        setCellProps: () => ({ style: { textAlign: "center" } }),
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
      <Search />
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={result} columns={columns} options={options} />
      </ThemeProvider>
      {renderSnackBar()}
    </>
  );
};

export default ProjectMemberDetails;
