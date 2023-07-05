import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import themeDefault from "../../styles/theme/theme";
import TeamDetails from "../../../utils/UserDetails";

function Thanks() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <ThemeProvider theme={themeDefault}>
      <Grid sx={{ mt: 15 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "50px",
            lineHeight: 1.17,
            color: "#51504f",
            marginBottom: "80px",
          }}
        >
          Our Team
        </Typography>
        <Grid container spacing={1} sx={{ ml: "13px" }}>
          {TeamDetails?.map((el, i) => (
            <Grid item xs={6} sm={6} md={3} lg={3} xl={3} sx={{ p: 8 }}>
              <Card>
                <CardMedia sx={{ height: 300 }} image={el.img} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {el.Name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {el.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
export default Thanks;
