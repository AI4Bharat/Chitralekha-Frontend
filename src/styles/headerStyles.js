import { makeStyles } from "@mui/styles";

const headerStyle = makeStyles({
  parentContainer: {
    // flexGrow : 1,
    // marginBottom: window.innerHeight * 0.13,
    // width: window.innerWidth * 0.98,
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
    fontFamily: "sans-serif",
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
    "@media (max-width: 1024px) and (min-width: 900px)": {
      fontSize: "16px",
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
    "@media (max-width: 1024px) and (min-width: 900px)": {
      fontSize: "16px",
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
    "@media (max-width: 1024px) and (min-width: 900px)": {
      fontSize: "1.8rem !important",
    },
    "@media (min-width: 1025px)": {
      fontSize: "2.25rem !important",
    },
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
  drawer: {
    width: "50%",
    flexShrink: 0,
  },
  drawerPaper: {
    width: "50%",
    padding: "0",
    transition: "all 0.8s ease-in-out",
    overflowX: "hidden",
  },
  navbar_banner: {
    position: "sticky",
    top: "0px",
    zIndex: 10,
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  },
  mobileNav_avatar: {
    backgroundColor: "#2A61AD !important",
    width: 45,
    height: 45,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
    "@media (max-width: 600px)": {
      width: 40,
      height: 40,
    },
    "@media (max-width: 400px)": {
      width: 30,
      height: 30,
    },
  },
  username: {
    color: "#000",
    fontWeight: 500,
    // fontSize: "1.4rem !important",
    fontSize: "clamp('12px', '2vw', '4.4rem')",
  },
  closeButton: {
    position: "absolute",
    right: 8,
    top: 8,
    zIndex: 100,
    color: "rgba(0, 0, 0, 0.6)",
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "rotate(90deg) !important",
      color: "#303F9A !important",
    },
    "@media (max-width: 600px)": {
      right: 4,
      top: 4,
    },
    "@media (max-width: 400px)": {
      right: 1,
      top: 1,
      padding: "1px 1px 0 0 !important",
    },
  },
  profileBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px",
  },
  sectionTitle: {
    fontSize: "1rem !important",
    fontWeight: 600,
    paddingX: "32px",
    marginX: "16px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "rgba(0, 0, 0, 0.6)",
    padding: "16px 16px 8px 16px",
    "@media (max-width: 600px)": {
      fontSize: "0.8rem !important",
    },
    "@media (max-width: 400px)": {
      fontSize: "0.7rem !important",
    },
    "@media (max-width: 300px)": {
      fontSize: "0.6rem !important",
    },
  },
  listItem: {
    cursor: "pointer",
    padding: "12px 12px",
    fontSize: "1.2rem !important",
    borderRadius: "8px",
    margin: "4px 16px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
      transform: "translateX(5px)",
    },
    "@media (max-width: 600px)": {
      fontSize: "0.9rem !important",
      padding: "8px 8px",
      margin: "4px 8px",
    },
    "@media (max-width: 400px)": {
      fontSize: "0.8rem !important",
      padding: "8px 8px",
      margin: "4px 8px",
    },
    "@media (max-width: 300px)": {
      fontSize: "0.7rem !important",
      padding: "8px 8px",
      margin: "4px 8px",
    },
  },
  logoutItem: {
    cursor: "pointer",
    padding: "12px 12px",
    borderRadius: "8px",
    fontSize: "1.2rem !important",
    margin: "4px 16px",
    color: "#f44336",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(244, 67, 54, 0.1)",
      transform: "translateX(5px)",
    },
    "@media (max-width: 600px)": {
      fontSize: "0.9rem !important",
      padding: "8px 8px",
      margin: "4px 8px",
    },
    "@media (max-width: 400px)": {
      fontSize: "0.8rem !important",
      padding: "8px 8px",
      margin: "4px 8px",
    },
    "@media (max-width: 300px)": {
      fontSize: "0.7rem !important",
      padding: "8px 8px",
      margin: "4px 8px",

    },
  },
  menuButton: {
    color: "#2C2799",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "rotate(90deg)",
      color: "#303F9A",
    },
  },
});

export default headerStyle;
