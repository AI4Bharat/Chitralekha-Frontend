import { Button, Grid, TextField } from "@mui/material";
import { validateEmail } from "utils/utils";

const NewsLetter = ({ susbscribeToNewsLetter, subscribe, email, setEmail }) => {
  return (
    <Grid container display={"flex"} alignItems={"center"} flexWrap={"nowrap"}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <TextField
          placeholder="emailId@example.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        {subscribe ? (
          <Button
            variant="contained"
            onClick={() => susbscribeToNewsLetter("unsubscribe")}
            disabled={!validateEmail(email)}
            sx={{ mr: "10px" }}
          >
            Un-Subscribe
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => susbscribeToNewsLetter("subscribe")}
            disabled={!validateEmail(email)}
            sx={{ mr: "10px" }}
          >
            Subscribe
          </Button>
        )}

        {subscribe === true && (
          <Button
            variant="contained"
            onClick={() => susbscribeToNewsLetter("update")}
            disabled={!validateEmail(email)}
          >
            Update
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default NewsLetter;
