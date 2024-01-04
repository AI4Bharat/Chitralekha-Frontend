import { useEffect, useState } from "react";
import { categoryConfig } from "config";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

//Styles
import { LoginStyle } from "styles";

//Components
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";

//APIs
import { APITransport, UpdateSubscriptionAPI } from "redux/actions";

const NewsLetterCategories = ({ email }) => {
  const classes = LoginStyle();
  const { id } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [selectedCategory, setSelectedCategory] = useState({
    downtime: true,
    release: true,
    general: true,
  });

  useEffect(() => {
    if (loggedInUser.subscribed_info) {
      const {
        subscribed_info: { categories },
      } = loggedInUser;

      setSelectedCategory({
        downtime: categories.includes("Downtime"),
        release: categories.includes("Release"),
        general: categories.includes("General"),
      });
    }
  }, [loggedInUser]);

  const handleChange = (event) => {
    setSelectedCategory({
      ...selectedCategory,
      [event.target.name]: event.target.checked,
    });
  };

  const handleCategoryUpdate = () => {
    const categories = ["Downtime", "Release", "General"].filter(
      (item) => selectedCategory[item.toLowerCase()]
    );

    const body = {
      email,
      user_id: +id,
      categories,
    };

    const newsLetterObj = new UpdateSubscriptionAPI(body);
    dispatch(APITransport(newsLetterObj));
  };

  return (
    <Grid container display={"flex"} alignItems={"center"}>
      <Grid item xs={12} md={8} className={classes.newLetterGridItems}>
        <FormGroup row>
          {categoryConfig.map((item) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCategory[item.name]}
                    onChange={handleChange}
                    name={item.name}
                  />
                }
                label={item.label}
              />
            );
          })}
        </FormGroup>
      </Grid>

      <Grid item xs={12} md={4} className={classes.newLetterGridItems}>
        <Button variant="contained" onClick={() => handleCategoryUpdate()}>
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default NewsLetterCategories;
