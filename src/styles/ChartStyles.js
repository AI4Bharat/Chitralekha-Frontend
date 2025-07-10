import { makeStyles } from "@mui/styles";

const ChartStyles = makeStyles((theme) => ({
  chartSection: {
    padding: "5% 15%",
    [theme.breakpoints.down("md")]: {
      padding: "5% 0%",
    },
  },

  modelChartSection: {
    padding: "4% 15%",
    [theme.breakpoints.down("md")]: {
      padding: "5% 0%",
    },
  },

  responsiveContainer: {
    width: "100%",
    height: 700,
    [theme.breakpoints.down("md")]: {
      innerHeight: "100%",
      innerWidth: "200%",
    },
  },

  heading: {
    fontSize: "36px",
    lineHeight: 1.17,
    color: "#51504f",
    marginBottom: "5px",
    fontFamily: '"rubik" ,"Roboto","Rowdies" ,sans-serif',
    fontWeight: "500",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#DEECFF",
    fontSize: "18px",
  },

  topBarInnerBox: {
    width: "25%",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    boxShadow: "3px 0 2px -2px #00000029",
  },

  titleStyle: {
    marginLeft: "25px",
    display: "flex",
    "@media (max-width:740px)": {
      marginRight: "0",
      display: "flex",
      flexDirection: "column",
    },
  },

  dropDownStyle: {
    display: "flex",
    marginLeft: ".68rem",
  },

  titleText: {
    marginLeft: "1.68rem",
    marginRight: ".5rem",
  },

  titleDropdown: {
    marginLeft: "1rem",
    minWidth: "10rem",
  },

  filterButton: {
    marginLeft: "auto",
    paddingRight: "1.5%",
    minWidth: "auto",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  fiterText: {
    marginTop: "3px",
    marginRight: "1.3rem",
    "@media (max-width:800px)": {
      display: "none",
    },
  },

  backButton: {
    boxShadow: "none",
    paddingTop: "5px",
    marginRight: ".5rem",
    borderRadius: "0",
  },

  toolTip: {
    width: "200px",
    height: "auto",
    backgroundColor: "white",
    color: "black",
    padding: "10px",
    border: "1px solid gray",
  },
}));

export default ChartStyles;
