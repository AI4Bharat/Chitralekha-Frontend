import { makeStyles } from "@mui/styles";
import ChitralekhabackgroundImage from "../assets/profileImages/Slide.png";

const IntroDatasetStyle = makeStyles({
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
    padding: "4rem",
    paddingTop: "8rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    height: "100vh",
    width: "100vw",
    "@media (max-width:767px)": {
      paddingTop: "6rem",
      padding: "1rem",
      flexDirection: "column",
    },
  },
  textSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "1rem",
    width: "67.5%",
    "@media (max-width:767px)": {
      width: "100%",
    },
  },
  imageWrpr: {
    width: "27.5%",
  },
  headerbtn: {
    color: "#51504f",
    textTransform: "capitalize",
    fontSize: "16px",
    fontFamily: "roboto,sans-serif",
    border: "2px solid red",
  },
  Chitralekhatitle: {
    fontWeight: "500",
    fontSize: "3rem",
    lineHeight: 1.1,
    color: "#3a3a3a",
    textAlign: "left",
    "@media (max-width:767px)": {
      fontSize: "2rem",
    },
  },
  details: {
    fontSize: "1.25rem",
    lineHeight: "1.5rem",
    textAlign: "justify",
    "@media (max-width:767px)": {
      fontSize: "1rem",
    },
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
  hover: {
    "&:hover": {
      textDecoration: "underline",
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
    float: "left",
  },
  titles: {
    fontSize: "55px",
    lineHeight: 1.17,
    color: "#51504f",
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
  principleTilesWrpr: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },

  tilesWrpr: {
    width: "50%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    gap: "1rem",
    "@media (max-width:767px)": {
      width: "100%",
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
    fontSize: "16px",
    fontFamily: "roboto,sans-serif",
    height: "35px",
    padding: "22px",
    "&:hover": {
      backgroundColor: "#04115E",
    },
  },
  thanks: {
    color: "white",
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
  usecaseImg: {
    width: "150px",
    margin: "25px 50px 20px 0px",
    float: "left",
    fontSize: "90px",
    color: "#2E86C1",
  },
  usecaseTitle: {
    display: "flex",
    fontWeight: 800,
    color: "#51504f",
    letterSpacing: "1px",
    fontSize: "24px",
    "@media (max-width:990px)": {
      lineHeight: "19px",
      fontSize: "20px",
    },
  },
  usecaseSubTitle: {
    display: "flex",
    fontWeight: 800,
    lineHeight: "1.17px",
    color: "#51504f",
    letterSpacing: "1px",
    fontSize: "20px",
  },
  usecaseCard: {
    width: window.innerWidth * 0.8,
    minHeight: 500,
    border: "1px solid #CCD1D1",
  },
  usecaseContent: {
    textAlign: "left",
    fontSize: "16px",
    color: "#707070",
    lineHeight: "25px",
    textAlign: "justify",
  },
  usecaseFeatures: {
    width: "100%",
    marginLeft: "20px",
    textAlign: "justify",
    fontSize: "16px",
    color: "#707070",
    padding: 0,
  },
  usecaseNote: {
    width: "100%",
    textAlign: "justify",
    fontSize: "12px",
    color: "#707070",
    fontWeight: 600,
    border: "1px solid black",
    padding: 5,
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
});

export default IntroDatasetStyle;
