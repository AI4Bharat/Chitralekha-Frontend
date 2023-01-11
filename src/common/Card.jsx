import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const CustomCard = ({ title, children, cardContent }) => {
  return (
    <Grid container alignItems="center" justifyContent="center">
      <Card elevation={3} style={{ border: "none", boxShadow: "none" }}>
        <CardContent>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography textAlign={"Left"} variant="h3">
              {title}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography textAlign={"Left"} variant="body1">
              To access the old Chitralekha tool, please visit{" "}
              <a
                href="https://lite.chitralekha.ai4bharat.org/"
                target={"blank"}
              >
                this
              </a>
            </Typography>
          </Grid>

          {/* <Divider /> */}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {cardContent}
          </Grid>
        </CardContent>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <CardActions style={{ marginBottom: "15px" }}>{children}</CardActions>
        </Grid>
      </Card>
    </Grid>
  );
};

export default CustomCard;
