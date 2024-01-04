import { makeStyles } from "@mui/styles";

const headerStyle = makeStyles({
  parentContainer: {
    // flexGrow : 1,
    marginBottom: window.innerHeight * 0.13,
    width: window.innerWidth * 0.98,
  },
  appBar: {
    // backgroundColor: "#ffffff",
    // position: 'inherit',
    // marginBotto m : '5%'
  },
  toolbar: {
    justifyContent: "space-between",
    maxWidth: "1272px",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    // padding: "inherit !important",
    padding: "0px !important",
    boxSizing: "border-box",
    minHeight: "54px",
    fontFamily: '"Roboto" ,sans-serif',
  },
  menu: {
    maxWidth: "1272px",
    width: "100%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  headerLogo: {
    height: "2rem",
  },
  headerMenu: {
    textDecoration: "none",
    backgroundColor: "transparent",
    padding: "12px ",
    color: "black",
    boxShadow: "none",
    fontSize: "19px",
    fontFamily: "Roboto",
    fontWeight: 500,
    letterSpacing: "0.5px",
    borderRadius: 12,
    "&:hover": {
      backgroundColor: "#E0E0E0",
      boxShadow: "none",
    },
  },
  highlightedMenu: {
    backgroundColor: "#E0E0E0",
    textDecoration: "none",
    padding: "12px ",
    color: "black",
    boxShadow: "none",
    fontSize: "19px",
    fontFamily: "Roboto",
    fontWeight: 500,
    borderRadius: 12,
    letterSpacing: "0.5px",
    "&:hover": {
      backgroundColor: "#E0E0E0",
      boxShadow: "none",
    },
  },
  avatar: {
    width: "36px",
    height: "36px",
    backgroundColor: "#2A61AD !important",
    fontSize: "14px",
    color: "#FFFFFF !important",
    "@media (max-width:640px)": {
      width: "26px",
      height: "26px",
    },
  },
  btnBox: {
    justifyContent: "center",
    color: "black",
  },
  Logo: {
    width: "45px",
  },
  navBtn: {
    color: "black",
    padding: "6px 8px",
    height: "58px",
    fontSize: "1rem",
  },
  avatarBox: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    color: "rgba(0, 0, 0, 0.54) !important",
    fontSize: "2.25rem !important",
  },
  icon2: {
    color: "rgba(0, 0, 0, 0.54) !important",
    fontSize: "2rem !important",
  },
  ArticleIconStyle: {
    // backgroundColor: "#D3E4F7",
    borderRadius: "35px",
    padding: "7px 8px 2px 8px ",
    marginRight: "15px",
  },
  mainHelpGridStyle: {
    width: "560px",
    padding: "15px 15px 0px 30px",
  },
  HelpGridStyle: {
    alignItems: "center",
    display: "flex",
    marginTop: "20px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#EBEEEF",
    },
  },
  listStyle: {
    marginTop: "10px",
  },
  spanStyle: {
    // fontFamily: "italic",
    fontWeight: "bold",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    cursor: "pointer",
    justifyContent: "space-evenly",
  },
  poweredByText: {
    fontSize: "0.7rem",
    fontWeight: "500",
    color: "#000000",
    margin: "auto",
  },
  imageBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default headerStyle;
