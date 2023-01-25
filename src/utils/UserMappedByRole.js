import { Typography } from "@mui/material"

const UserMappedByRole = (statusLabel) => {


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
    } else if (statusLabel == "Inprogress") {
        return {
            name: statusLabel, name: "Inprogress", element: <Typography variant="caption"
                sx={{ p: 1, backgroundColor: "rgb(255, 99, 71,0.2)", color: "rgb(255, 99, 71)", borderRadius: 2, fontWeight: 600 }}>Inprogress</Typography>
        }
    }
    else if (statusLabel == "Selected Source") {
        return {
            name: statusLabel, name: "Selected Source", element: <Typography variant="caption"
                sx={{ p: 1, backgroundColor: "rgb(165, 105, 189,0.2)", color: "rgb(165, 105, 189)", borderRadius: 2, fontWeight: 600 ,whiteSpace: "nowrap"}} >Selected Source</Typography>
        }
    }
}

export default UserMappedByRole;