import { makeStyles } from "@mui/styles";

const LoginStyle = makeStyles({
  appInfo: {
    background: "rgba(44, 39, 153, 1)",
    minHeight: "100vh",
    color: "white",
    // color: theme.palette.primary.contrastText,
    "@media (max-width:650px)": {
      background: "white",
      minHeight: "15vh",
    },
  },
  title: {
    width: "20%",
    height: "auto",
    margin: "22% 294px 10% 39px",
    cursor: "pointer",
    lineHeight: "1.53",
    letterSpacing: "3.9px",
    textAlign: "left",
    "@media (max-width:650px)": {
      margin: "0% 0% 00% 90%",
      color: "black",
    },
  },
  subTitle: {
    width: "80%",
    height: "auto",
    maxWidth: "300px",
    margin: "20% 70px 15% 39px",
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    "@media (max-width:1040px)": {
      letterSpacing: "1px",
      maxWidth: "280px",
      width: "80%",
    },
    "@media (min-width:1790px)": {
      width: "68%",
    },
  },
  body: {
    width: "80%",
    height: "auto",
    margin: "30px 0px 50px 39px",
    lineHeight: "1.5",
    letterSpacing: "1.6px",
    textAlign: "left",
    color: "#f2f2f4",
    "@media (max-width:1040px)": {
      letterSpacing: "1px",
      maxWidth: "280px",
    },
    "@media (min-width:1790px)": {
      width: "85%",
    },
  },
  parent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  containerForgotPassword: {
    marginTop: "2px",
    width: "70%",
    "@media (max-width:650px)": {
      width: "100%",
    },
  },
  link: {
    cursor: "pointer",
    width: "100%",
    color: "#2C2799",
    float: "right",
    fontSize: "0.875rem",
    fontFamily: '"lato" ,sans-serif',
    fontWeight: "600",
  },
  Typo: {
    marginRight: "6px",
  },
  createLogin: {
    marginTop: "2%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },

  profileTabs: {
    fontSize: 17,
    fontWeight: "700",
    marginRight: "28px !important",
  },

  editProfileParentCard: {
    width: "100%",
    borderRadius: "5px",
    marginBottom: "50px",
  },

  editProfileParentGrid: {
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1px solid rgb(224 224 224)",
    padding: "24px",
  },

  editProfileBtn: {
    borderRadius: "5px",
    lineHeight: "1px",
    fontSize: "16px",
    float: "right",
    width: "120px",
  },

  editIcon: {
    width: "15px",
    marginRight: "5px",
  },

  ChangePasswordSubText: {
    color: "gray",
    fontSize: "16px",
  },

  loginSecurityGrid: {
    flexDirection: "column",
    margin: "40px 0 0 0",
  },

  inputProfile: {
    fontSize: "1rem",
  },

  unsubscribeWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  categoryCheckbox: {
    "& .MuiFormControlLabel-label": { fontSize: "1rem" },
  },

  newLetterGridItems: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginStyle;
