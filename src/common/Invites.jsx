import React, { useState, useEffect } from "react";
import { 
  Tabs, 
  Tab, 
  Box, 
  Typography, 
  Alert,
  Chip,
  Tooltip,
  IconButton
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Loader } from "common";
import { ThemeProvider } from "@mui/material/styles";
import { tableTheme } from "theme";
import { getColumns, getOptions } from "utils";
import MUIDataTable from "mui-datatables";
import GetManagerSuggestionsAPI from "redux/actions/api/Organization/GetManagerSuggestions";
import ApproveManagerSuggestionsAPI from "redux/actions/api/Organization/ApproveManagerSuggestions";
import RejectManagerSuggestionsAPI from "redux/actions/api/Organization/RejectManagerSuggestions";
import { APITransport, setSnackBar } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";

const Invites = ({ orgId }) => {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);
  const [tabValue, setTabValue] = useState(0);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPendingUsers();
    // eslint-disable-next-line
  }, [tabValue, orgId]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const apiObj = new GetManagerSuggestionsAPI(2);
      const res = await fetch(apiObj.apiEndPoint(), apiObj.getHeaders());
      if (!res.ok) throw new Error("Failed to fetch pending users");
      const data = await res.json();
      const userArr = Array.isArray(data) ? data : data.data || [];
      const pending = userArr.filter((user) => user.has_accepted_invite === false);
      setPendingUsers(pending);
    } catch (err) {
      setError(err.message || "Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setLoading(true);
    setError("");
    try {
      const apiObj = new ApproveManagerSuggestionsAPI(userId);
      const res = await fetch(apiObj.apiEndPoint(), { method: "POST", ...apiObj.getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to approve");
      
      dispatch(setSnackBar({
        open: true,
        message: "Suggestion approved successfully",
        variant: "success",
      }));
      
      await fetchPendingUsers();
    } catch (err) {
      setError(err.message || "Failed to approve");
      dispatch(setSnackBar({
        open: true,
        message: "Failed to approve suggestion",
        variant: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId) => {
    setLoading(true);
    setError("");
    try {
      const apiObj = new RejectManagerSuggestionsAPI(userId);
      const res = await fetch(apiObj.apiEndPoint(), { method: "DELETE", ...apiObj.getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reject");
      
      dispatch(setSnackBar({
        open: true,
        message: "Suggestion rejected successfully",
        variant: "success",
      }));
      
      await fetchPendingUsers();
    } catch (err) {
      setError(err.message || "Failed to reject");
      dispatch(setSnackBar({
        open: true,
        message: "Failed to reject suggestion",
        variant: "error",
      }));
    } finally {
      setLoading(false);
    }
  };

  const managerSuggestions = pendingUsers.filter((user) => user.invited_by !== null);

  // Prepare data for MUIDataTable
  const prepareTableData = (users) => {
    return users.map(user => [
      user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.username || "N/A",
      user.email,
      user.role,
      user.invited_by || "N/A",
      user.has_accepted_invite ? "Accepted" : "Pending",
      user.id // for actions
    ]);
  };

  // Define columns for Invited Users tab
  const invitedUsersColumns = [
    { name: "Name", label: "Name" },
    { name: "Email", label: "Email" },
    { name: "Role", label: "Role" },
    { name: "Status", label: "Status" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        customBodyRender: (value, tableMeta) => {
          return (
            <Tooltip title="View">
              <IconButton size="small" color="primary">
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          );
        },
      },
    },
  ];

  // Define columns for Manager Suggestions tab
  const managerSuggestionsColumns = [
    { name: "Name", label: "Name" },
    { name: "Email", label: "Email" },
    { name: "Role", label: "Role" },
    { name: "Invited By", label: "Invited By" },
    { name: "Status", label: "Status" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        customBodyRender: (value, tableMeta) => {
          const { tableData, rowIndex } = tableMeta;
          const userId = tableData[rowIndex][5]; // user ID is in the 6th column
          const user = pendingUsers.find(u => u.id === userId);
          
          return (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="View">
                <IconButton size="small" color="primary">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              {user && !user.has_accepted_invite && (
                <>
                  <Tooltip title="Approve">
                    <IconButton
                      color="success"
                      onClick={() => handleApprove(userId)}
                      disabled={loading}
                      size="small"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton
                      color="error"
                      onClick={() => handleReject(userId)}
                      disabled={loading}
                      size="small"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          );
        },
      },
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(_e, v) => setTabValue(v)}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            fontSize: 16,
            fontWeight: "700",
            textTransform: "none",
            minWidth: "auto",
            padding: "12px 24px",
            "&.Mui-selected": {
              backgroundColor: "#d3d3d3",
              color: "black",
              borderRadius: 1,
            }
          }
        }}
      >
        <Tab label="Invited Users" />
        <Tab label="Manager Suggestions" />
      </Tabs>
      
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error}
        </Alert>
      )}
      
      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <Loader />
        </Box>
      ) : (
        <Box>
          {tabValue === 0 ? (
            // Invited Users Tab
            <ThemeProvider theme={tableTheme}>
              <MUIDataTable
                title=""
                data={prepareTableData(pendingUsers)}
                columns={invitedUsersColumns}
                options={{
                  ...getOptions(loading),
                  search: true,
                  download: true,
                  filter: false,
                  viewColumns: true,
                  selectableRows: "none",
                  customBodyRender: (value, tableMeta) => {
                    const { columnIndex } = tableMeta;
                    if (columnIndex === 3) { // Status column
                      return (
                        <Chip
                          label={value}
                          color={value === "Accepted" ? "success" : "warning"}
                          size="small"
                        />
                      );
                    }
                    return value;
                  },
                }}
              />
            </ThemeProvider>
          ) : (
            // Manager Suggestions Tab
            <ThemeProvider theme={tableTheme}>
              <MUIDataTable
                title=""
                data={prepareTableData(managerSuggestions)}
                columns={managerSuggestionsColumns}
                options={{
                  ...getOptions(loading),
                  search: true,
                  download: true,
                  filter: false,
                  viewColumns: true,
                  selectableRows: "none",
                  customBodyRender: (value, tableMeta) => {
                    const { columnIndex } = tableMeta;
                    if (columnIndex === 4) { // Status column
                      return (
                        <Chip
                          label={value}
                          color={value === "Accepted" ? "success" : "warning"}
                          size="small"
                        />
                      );
                    }
                    return value;
                  },
                }}
              />
            </ThemeProvider>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Invites; 