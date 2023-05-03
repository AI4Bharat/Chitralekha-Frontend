import { makeStyles } from "@mui/styles";

const DatasetStyle = makeStyles({
  Projectsettingtextarea: {
    width: "100%",
    fontSize: "1.4rem",
    fontFamily: "Roboto",
    fontWeight: 10,
    lineHeight: 1.2,
  },
  workspaceTables: {
    marginTop: "20px",
  },
  projectButton: {
    width: "100%",
    textDecoration: "none",
  },
  annotatorsButton: {
    width: "100%",
  },
  managersButton: {
    width: "100%",
  },
  settingsButton: {
    width: "100%",
    backgroundColor: "red",
  },
  workspaceCard: {
    width: "100%",
    minHeight: "500px",
    padding: "40px",
    justifyContent: "center",
    justifyItems: "center",
  },
  projectsettingGrid: {
    margin: "20px 0px 10px 0px",
  },
  filterToolbarContainer: {
    // alignItems : 'center',
    // display : 'inline',
    // textAlign : "end"
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "10px",
  },
 
  filterContainer: {
    borderBottom: "1px solid #00000029",
    paddingLeft: "18.5px",
    marginTop: "20px",
    width: "750px",
    maxHeight: "270px",
    overflow: "auto",
    "@media (max-width:550px)": {
      width: "330px",
      maxHeight: "170px",
    },
  },
  filterTypo: {
    marginBottom: "9px",
  },
  statusFilterContainer: {
    // display : 'contents',
    alignItems: "center",
  },
 
  applyBtn: {
    float: "right",
    borderRadius: "20px",
    margin: "9px 16px 9px auto",
    width: "80px",
  },
  clrBtn: {
    float: "right",
    borderRadius: "20px",
    margin: "9px 10px 9px auto",
    width: "100px",
  },
  menuStyle: {
    padding: "0px",
    justifyContent: "left",
    fontSize: "1.125rem",
    fontWeight: "500 !important",

    "&:hover": {
      backgroundColor: "white",
    },
    borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
    // borderTop:"3px solid green",
    "& svg": {
      marginLeft: "auto",
      color: "rgba(0, 0, 0, 0.42)",
    },
  },
  projectCardContainer: {
    cursor: "pointer",
  },
  modelname: {
    boxSizing: "border-box",
    // marginTop: "15px",
    height: "64px",
    backgroundColor: "white",
    maxWidth: "90%",
    minWidth: "90%",
    width: "auto",
    display: "flex",
    alignItems: "center",
    padding: "0 15px",
    borderRadius: "12px",
  },
  parentContainer: {
    minHeight: "100vh",
    // direction: "row",
    alignItems: "center",
    paddingBottom: "5vh",
    // justifyContent: "space-around",
    flexGrow: 0,
  },
  projectCardContainer1: {
    backgroundColor: "#2A61AD",
    height: "100%",
    width: "100%",
  },
  projectCardContainer2: {
    backgroundColor: "#119DA4",
    height: "100%",
    width: "100%",
  },
  userCardContainer: {
    direction: "column",
    alignItems: "center",
    height: "100%",
    placeContent: "center",
  },
  dashboardContentContainer: {
    alignItems: "left",
    justifyContent: "space-around",
    minHeight: "70vh",
    borderLeft: "1px solid lightgray",
    paddingLeft: "5%",
  },
  link: {
    textDecoration: "none",
  },
  progress: {
    position: "relative",
    top: "40%",
    left: "46%",
  },
  progressDiv: {
    position: "fixed",
    // backgroundColor: 'rgba(0.5, 0, 0, 0.5)',
    zIndex: 1000,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 1,
  },
  search: {
    // position: "relative",
    borderRadius: "24px",
    backgroundColor: "#F3F3F3",
    marginLeft: "0px",
    width: "500px",
    textAlign: "left",
    // float: "right",
    marginBottom: "30px",
    position: "absolute",
    right: "200px",
    top: "105px",
  },
  searchIcon: {
    // padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00000029",
    marginLeft: "10px",
  },
  divider: {
    borderLeft: "1px solid #E0E0E0",
    height: "200px",
    position: "absolute",
  },
  rootdiv: {
    marginTop: "25px",
  },
  orgCard: {
    width: "100%",
    minHeight: "500px",
    padding: "40px",
    justifyContent: "center",
    justifyItems: "center",
  },
  tableData: {
    height: "500px",
    overflowY: "scroll",
    marginTop: "15px",
  },
  Typographyvalue: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#D6EAF8",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#E9F7EF",
    },
  },
  tableButton: {
    borderRadius: "7px",
    textAlign: "center",
    inlineSize: "max-content",
    marginRight: 2,
    textDecoration: "none",
  },
  
  search: {
    //position: "relative",
    borderRadius: "24px",
    backgroundColor: "#F3F3F3",
    marginLeft: "0px",
    width: "350px",
    //textAlign: "left",
    //justifyContent:"center"
    //float: "right",
    //   position: "absolute",
    //  Right: "200px",
    //  top:"155px",
  },
  searchIcon: {
    // padding: theme.spacing(0, 2),
    // height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00000029",
    marginLeft: "10px",
    marginTop: "7px",
  },
  descCardIcon: {
    display: "flex",
    borderRadius: "20%",
    padding: "15px",
    height: "fit-content",
  },
  mainTitle: { color: "white" },
  modelTitle: {
    marginTop: "20px",
    // padding: 0,
  },

  createTaskBtn: {
    backgroundColor: "rgba(44, 39, 153, 0.04)",
    borderRadius: "50%",
    color: "#2C2799",
    margin: "0 5px",
    padding: "4px",
    verticalAlign: "sub",
    "& .MuiSvgIcon-root": {
      fontSize: "1.3rem"
    }
  },
  searchStyle:{
    position: "absolute",
    //  right: "107px",
    bottom: "2px",
    width: "85%",
    justifyContent: "flex-end",
  },
  TaskListsearch:{
    position: "absolute",
     right: "175px",
      bottom: "2px"

  },
  clearAllBtn: {
    // float: "right",
     margin: "10px 10px 10px 0px",
    padding: "14px",
    // height: "15px",
  },
  Changepassword:{
    color: "gray", 
    marginTop: "-20px" ,
    fontFamily: "fangsong",
    fontSize:"18px"
  }
});

export default DatasetStyle;
