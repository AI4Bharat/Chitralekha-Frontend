import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { validateEmail } from "utils/utils";

//Styles
import { LoginStyle } from "styles";

//Components
import { Button, Grid, TextField } from "@mui/material";

//APIs
import { APITransport } from "redux/actions";
import UpdateNewsLetterEmailAPI from "redux/actions/api/Admin/UpdateNewsLetterEmail";

const NewsLetterEmail = ({ email, setEmail }) => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  useEffect(() => {
    if (loggedInUser.subscribed_info) {
      const {
        subscribed_info: { email },
      } = loggedInUser;

      setEmail(email);
    }

    //eslint-disable-next-line
  }, [loggedInUser]);

  const handleEmailUpdate = () => {
    const newsLetterObj = new UpdateNewsLetterEmailAPI(email, +id);
    dispatch(APITransport(newsLetterObj));
  };

  return (
    <Grid container display={"flex"} alignItems={"center"} gap={2}>
      <Grid item xs={12} md={8} className={classes.newLetterGridItems}>
        <Grid container direction="column" alignItems={"flex-start"} rowSpacing={2}>
          <Grid item>
            <TextField
              fullWidth
              sx={{ width: '350px' }}
              placeholder="emailId@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => handleEmailUpdate()}
              disabled={!validateEmail(email)}
            >
              Update Email
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewsLetterEmail;
