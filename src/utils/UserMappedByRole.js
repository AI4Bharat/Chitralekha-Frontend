import { Typography } from "@mui/material"

const UserMappedByRole = (statusLabel) => {

console.log(statusLabel,'statusLabel');
    if (statusLabel == "Complete") {
        return {
            name: statusLabel, name: "Complete", element: <Typography variant="caption"
                sx={{
                    p: 1, backgroundColor: "rgb(56, 158, 13,0.2)", color: "rgb(56, 158, 13)" ,borderRadius: 2, fontWeight: 600
                }}>Complete</Typography>
        }
    } else if (statusLabel == "New") {
        return {
            name: statusLabel, name: "New", element: <Typography variant="caption"
                sx={{
                    p: 1,  backgroundColor: "rgb(50, 100, 168,0.2)", color: "rgb(50, 100, 168)",
                    borderRadius: 2, fontWeight: 600
                }}>New</Typography>
        }
    } else if (statusLabel == "In Progress") {
        return {
            name: statusLabel, name: "In Progress", element: <Typography variant="caption"
                sx={{ p: 1, backgroundColor: "rgb(255, 99, 71,0.2)", color: "rgb(255, 99, 71)", borderRadius: 2, fontWeight: 600,whiteSpace: "nowrap" }}>In Progress</Typography>
        }
    }
    else if (statusLabel == "Selected Source") {
        return {
            name: statusLabel, name: "Selected Source", element: <Typography variant="caption"
                sx={{ p: 1, backgroundColor: "rgb(165, 105, 189,0.2)", color: "rgb(165, 105, 189)", borderRadius: 2, fontWeight: 600 ,whiteSpace: "nowrap"}} >Selected Source</Typography>
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
              backgroundColor: "rgb(234, 100, 168,0.2)",
              color: "rgb(234, 100, 168)",
              borderRadius: 2,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Post Process
          </Typography>
        ),
      };
    }
}

export default UserMappedByRole;