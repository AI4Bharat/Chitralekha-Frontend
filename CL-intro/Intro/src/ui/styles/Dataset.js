import { makeStyles } from "@mui/styles";
import ChitralekhabackgroundImage from "../../img/Slide.png";

const DatasetStyle = makeStyles({
  Chitralekhalogo: {
    width: "100%",
    height: "100%",
    margin: "0px 0px -7px 0px",
  },
  section: {
    backgroundImage: `url(${ChitralekhabackgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "0 5%",
    display: "flex",
    alignItems: "center",
    height: "700px",
  },
  headerbtn: {
    color: "#51504f",
    textTransform: "capitalize",
    fontSize: "16px",
    fontFamily: "roboto,sans-serif",
  },
  Chitralekhatitle: {
    fontWeight: "500",
    fontSize: "62px",
    lineHeight: 1.17,
    color: "#3a3a3a",
    textAlign: "left",
    margin: "0 35px 25px 45px",
  },
  footerGridMain: {
    backgroundColor: "#51504f",
    padding: "20px",
    color: "white",
    display: "grid",
    textAlign: "end",
  },
  footerGridMains: {
    backgroundColor: "#51504f",
    color: "white",
    display: "flex",
    textAlign: "start",
  },
  footerGrid: {
    backgroundColor: "#636365",
    padding: "3px 45px 3px 3px",
    color: "white",
    "@media (max-width:1200px)": {
      padding: "3px 3px 3px 3px",
    },
  },
  footerGridlast: {
    backgroundColor: "#636365",
    padding: "3px 0px 3px 60px",
    color: "white",
    textDecoration: "none",
    "@media (max-width:1200px)": {
      padding: "3px 3px 3px 3px",
    },
  },
  partnersPaper: {
    padding: "2px 4px",
    display: "block",
    alignItems: "center",
    width: "250px",
    "&:hover": {
      backgroundColor: "#E0E0E0",
    },
  },
  featuresimg: {
    width: "150px",
    margin: "20px 50px 12px 0px",
    float: "left",
  },
  titles: {
    fontSize: "55px",
    lineHeight: 1.17,
    color: "#51504f",
    marginBottom: "50px",
  },
  featuresTitle: {
    display: "flex",
    fontWeight: 500,
    lineHeight: "1.17px",
    color: "#51504f",
    letterSpacing: "1px",
    "@media (max-width:990px)": {
      lineHeight: "19px",
      fontSize: "20px",
    },
  },
  principlesContent: {
    fontSize: "16px",
    color: "#707070",
    lineHeight: "25px",
  },
  featuresContent: {
    textAlign: "left",
    fontSize: "16px",
    color: "#707070",
    lineHeight: "25px",
  },
  principlesTitle: {
    letterSpacing: "1px",
    fontSize: "35px",
    lineHeight: 1.17,
    color: "#51504f",
    justifyContent: "center",
    "@media (max-width:550px)": {
      fontSize: "28px",
    },
  },
  homeLink: {
    color: "#000",
    textDecoration: "underline",
    "&:hover": {
      color: "#000",
      textDecoration: "underline",
    },
  },
  description: {
    fontSize: "1.25rem",
    lineHeight: "2rem",
    margin: "0 35px 25px 0",
    textAlign: "justify",
  },
  Principlesimg: {
    width: "100px",
    margin: "20px 0px 12px 0px",
  },
  footerimg: {
    width: "40px",
    margin: "20px 0px 12px 35px",
    borderRadius: "15%",
    maxHeight: "40px",
  },
  buttons: {
    textTransform: "capitalize",
    padding: "10px",
    backgroundColor: "rgb(44, 39, 153)",
    borderRadius: "5px",
    display: "flex",
    marginLeft: "42px",
    fontSize: "16px",
    fontFamily: "roboto,sans-serif",
    height: "35px",
    marginTop: "8px",
    marginRight: "30px",
    padding: "22px",
    "&:hover": {
      backgroundColor: "#04115E",
    },
  },
  thanks: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
    userImg: {
      maxHeight: "300px",
      maxWidth: "200px",
      borderRadius: "50%",
      marginTop: "5px",
    },
  },
  button: {
    backgroundColor: "rgb(44, 39, 153)",
    textTransform: "capitalize",
    fontSize: "16px",
    fontFamily: "roboto,sans-serif",
    height: "35px",
    marginTop: "8px",
    marginRight: "30px",
    padding: "22px",
    "&:hover": {
      backgroundColor: "#04115E",
    },
  },
});

export default DatasetStyle;
