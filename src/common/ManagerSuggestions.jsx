import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Loader } from "common";
import GetManagerSuggestionsAPI from "redux/actions/api/Organization/GetManagerSuggestions";
import ApproveManagerSuggestionsAPI from "redux/actions/api/Organization/ApproveManagerSuggestions";
import RejectManagerSuggestionsAPI from "redux/actions/api/Organization/RejectManagerSuggestions";
import { APITransport } from "redux/actions";
import { useDispatch, useSelector } from "react-redux";

// TODO: Import your real APIs when available
// import FetchProjectManagerSuggestions from "redux/actions/api/Project/FetchProjectManagerSuggestions";
// import ApproveProjectManagerSuggestion from "redux/actions/api/Project/ApproveProjectManagerSuggestion";
// import RejectProjectManagerSuggestion from "redux/actions/api/Project/RejectProjectManagerSuggestion";
// import { APITransport } from "redux/actions";
// import { useDispatch } from "react-redux";

const ProjectManagerSuggestions = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get the logged-in manager's org ID from Redux
  const userData = useSelector(state => state.getLoggedInUserDetails?.data);
  const managerOrgId = userData?.organization?.id;

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    try {
      const apiObj = new GetManagerSuggestionsAPI(2);
      const res = await fetch(apiObj.apiEndPoint(), apiObj.getHeaders());
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      const data = await res.json();
      // Shoonya-style: use data.data as user list, filter for has_accepted_invite === false
      const userArr = Array.isArray(data) ? data : data.data || [];
      const pendingInvites = userArr.filter((user) => user.has_accepted_invite === false);
      console.log('Debug - userArr:', userArr);
      console.log('Debug - pendingInvites:', pendingInvites);
      setSuggestions(pendingInvites);
    } catch (err) {
      setError("Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && managerOrgId) {
      fetchSuggestions();
    }
    // eslint-disable-next-line
  }, [open, managerOrgId]);

  const handleApprove = async (suggestionId) => {
    setLoading(true);
    setError("");
    try {
      const apiObj = new ApproveManagerSuggestionsAPI(suggestionId);
      const res = await fetch(apiObj.apiEndPoint(), { method: "POST", ...apiObj.getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to approve");
      await fetchSuggestions();
    } catch (err) {
      setError("Failed to approve suggestion");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (suggestionId) => {
    setLoading(true);
    setError("");
    try {
      const apiObj = new RejectManagerSuggestionsAPI(suggestionId);
      const res = await fetch(apiObj.apiEndPoint(), { method: "DELETE", ...apiObj.getHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reject");
      await fetchSuggestions();
    } catch (err) {
      setError("Failed to reject suggestion");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ style: { borderRadius: "10px" } }}
    >
      <DialogTitle>
        <Typography variant="h5">Project Manager Suggestions</Typography>
        <Typography variant="body2" color="textSecondary">
          Review and approve/reject project member suggestions from managers
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <Loader />
          </Box>
        ) : suggestions.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            No suggestions found.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suggestions.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.has_accepted_invite ? "Accepted" : "Pending"}
                        color={user.has_accepted_invite ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {!user.has_accepted_invite && (
                        <Box>
                          <Tooltip title="Approve">
                            <IconButton
                              color="success"
                              onClick={() => handleApprove(user.id)}
                              disabled={loading}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              color="error"
                              onClick={() => handleReject(user.id)}
                              disabled={loading}
                            >
                              <CancelIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectManagerSuggestions; 