import { useState } from "react";
import { useDispatch } from "react-redux";
import { APITransport, NewsletterSubscribe } from "redux/actions";
import { validateEmail } from "utils/utils";

const { Grid, Typography, TextField, Button } = require("@mui/material");

const NewsLetter = (props) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const handleSubscribe = () => {
    const apiObj = new NewsletterSubscribe(email);
    dispatch(APITransport(apiObj));
  };

  const handleEmailChange = (e) => {
    if (validateEmail(e.target.value)) setEmail(e.target.value);
  };
  return (
    <Grid spacing={0} container sx={{ p: "40px",justifyContent:"center", alignItems: "center" }}>
      {/* <Grid
        display="flex"
        justifyContent="center"
        item
        xs={12}
        sm={12}
        md={5}
        lg={5}
        xl={5}
      >
        <Typography variant="body1">Enter Email</Typography>
      </Grid> */}
      <Grid
        display="flex"
        justifyContent="center"
        item
        xs={12}
        sm={12}
        md={4}
        lg={4}
        xl={4}
      >
        <TextField placeholder="Email Id" onChange={handleEmailChange} />
      </Grid>
      <Grid
        display="flex"
        justifyContent="center"
        item
        xs={12}
        sm={12}
        md={4}
        lg={4}
        xl={4}
      >
        <Button variant="contained" onClick={handleSubscribe} disabled={!email}>
          Subscribe
        </Button>
      </Grid>
    </Grid>
  );
};

export default NewsLetter;
