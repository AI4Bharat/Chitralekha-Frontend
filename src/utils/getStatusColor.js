import { Typography } from "@mui/material";

const colors = [
  {
    label: "Complete",
    color: "green",
  },
  {
    label: "New",
    color: "maroon",
  },
  {
    label: "In Progress",
    color: "blue",
  },
  {
    label: "Selected Source",
    color: "purple",
  },
  {
    label: "Post Process",
    color: "darkcyan",
  },
  {
    label: "Failed",
    color: "#e60073",
  },
  {
    label: "Reopen",
    color: "darkblue",
  },
  {
    label: "Pending",
    color: "purple",
  },
  {
    label: "On Hold",
    color: "blue",
  },
  {
    label: "Approved",
    color: "green",
  },
  {
    label: "Rejected",
    color: "red",
  },
];

const getColor = (status) => {
  const temp = colors.filter(
    (item) => item.label.toLocaleLowerCase() === status.toLocaleLowerCase()
  );
  return temp[0].color;
};

const statusColor = (statusLabel) => {
  return {
    name: statusLabel,
    element: (
      <Typography
        variant="caption"
        sx={{
          p: 1,
          backgroundColor: "#fff",
          color: getColor(statusLabel),
          borderRadius: 2,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {statusLabel}
      </Typography>
    ),
  };
};

export default statusColor;
