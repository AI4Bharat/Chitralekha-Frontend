import { Typography } from "@mui/material"

const UserMappedByRole = (statusLabel) => {

console.log(statusLabel,'statusLabel');
    if (statusLabel == "Complete") {
        return {
            name: statusLabel, name: "Complete", element: <Typography variant="caption"
                sx={{
                    p: 1, backgroundColor: "#fff", color:"green" ,borderRadius: 2, fontWeight: 600
                }}>Complete</Typography>
        }
    } else if (statusLabel == "New") {
        return {
            name: statusLabel, name: "New", element: <Typography variant="caption"
                sx={{
                    p: 1,  backgroundColor: "#fff", color: "blue",
                    borderRadius: 2, fontWeight: 600
                }}>New</Typography>
        }
    } else if (statusLabel == "In Progress") {
        return {
            name: statusLabel, name: "In Progress", element: <Typography variant="caption"
                sx={{ p: 1, backgroundColor: "#fff", color: "maroon", borderRadius: 2, fontWeight: 600,whiteSpace: "nowrap" }}>In Progress</Typography>
        }
    }
    else if (statusLabel == "Selected Source") {
        return {
            name: statusLabel, name: "Selected Source", element: <Typography variant="caption"
                sx={{ p: 1, backgroundColor: "#fff", color: "purple", borderRadius: 2, fontWeight: 600 ,whiteSpace: "nowrap"}} >Selected Source</Typography>
        }
    } else if (statusLabel == "Post Process") {
      return {
        name: statusLabel,
        name: "Post Process",
        element: (
          <Typography
            variant="caption"
            sx={{
              p: 1,
              backgroundColor: "#fff",
              color: "darkcyan",
              borderRadius: 2,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Post Process
          </Typography>
        ),
      };
    } else if(statusLabel === "Failed") {
      return {
        name: statusLabel,
        element: (
          <Typography
            variant="caption"
            sx={{
              p: 1,
              backgroundColor: "#fff",
              color: "#e60073",
              borderRadius: 2,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Failed
          </Typography>
        ),
      };
    }
}

export default UserMappedByRole;