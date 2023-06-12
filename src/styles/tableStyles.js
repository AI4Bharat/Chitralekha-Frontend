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

  customTableHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: "5px",
    flexGrow: "1",
    alignItems: "center",
  },

  selectColumnContainer: {
    padding: "20px",
    width: "300px",
    height: "fit-content",
    maxHeight: "350px",
    "@media (max-width:550px)": {
      width: "330px",
      maxHeight: "170px",
    },
  },

  selectColumnHeader: {
    color: "rgba(0, 0, 0, 0.6)",
    fontSize: "14px",
    fontFamily: "Roboto",
    fontWeight: 500,
  },

  selectColumnGrid: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
});

export default TableStyles;
