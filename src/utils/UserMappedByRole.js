import { Typography } from "@mui/material";
import { roles } from "./utils";

const UserMappedByRole = (roleValue) => {
    // Find the role based on the provided roleValue
    const role = roles.find(role => role.value === roleValue);

    // Return a default Typography if the role is not found
    if (!role) {
        return { id: null, name: "Unknown", element: <Typography variant="caption" sx={{p:1, backgroundColor:"grey", color:"white", borderRadius:2, fontWeight: 600 }}>Unknown</Typography> };
    }

    // Map the role to a Typography element with specific styling
    const roleColors = {
        "TRANSCRIPT_EDITOR": "rgb(56, 158, 13, 0.2)",
        "TRANSCRIPT_REVIEWER": "rgb(142, 68, 173, 0.2)",
        "TRANSLATION_EDITOR": "rgb(243, 156, 18, 0.2)",
        "TRANSLATION_REVIEWER": "rgb(40, 116, 166, 0.2)",
        "UNIVERSAL_EDITOR": "rgb(97, 106, 107, 0.2)",
        "PROJECT_MANAGER": "rgb(255, 99, 71, 0.2)",
        "ORG_OWNER": "rgb(97, 106, 107, 0.2)"
    };

    const color = roleColors[role.value] || "grey";

    return {
        id: role.value,
        name: role.label,
        element: (
            <Typography variant="caption" sx={{ p: 1, backgroundColor: color, color: "black", borderRadius: 2, fontWeight: 600 }}>
                {role.label}
            </Typography>
        )
    };
};

export default UserMappedByRole;
