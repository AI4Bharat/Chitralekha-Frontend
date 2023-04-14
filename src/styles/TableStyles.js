import { makeStyles } from "@mui/styles";

const TableStyles = makeStyles({
  cellHeaderProps: {
    height: "32px",
    fontSize: "16px",
    padding: "16px",
  },

  cellActionHeaderProps: {
    height: "32px",
    fontSize: "16px",
    textAlign: "center",
  },

  cellVideoHeaderProps: {
    height: "30px",
    fontSize: "16px",
    padding: "16px",
    width: "60px",
  },

  cellProps: {
    height: "40px",
  },
});

export default TableStyles;
