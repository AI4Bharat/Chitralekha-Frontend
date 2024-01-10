import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//Component
import { FormControlLabel, Grid, Switch, Tooltip } from "@mui/material";

//APIs
import { APITransport, ToggleMailsAPI, UpdateProfileAPI } from "redux/actions";

const DailyEmailToggle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

  const [dailyEmail, setDailyEmail] = useState(false);
  const [orgOwnerId, setOrgOwnerId] = useState("");

  useEffect(() => {
    if (loggedInUser.id) {
      const {
        organization: { organization_owner },
        enable_mail,
      } = loggedInUser;

      setOrgOwnerId(organization_owner.id);
      setDailyEmail(enable_mail);
    }
  }, [loggedInUser]);

  const handleSwitchToggleEmail = () => {
    setDailyEmail((prev) => !prev);

    let updateProfileReqBody = {
      enable_mail: !dailyEmail,
    };

    const apiObj = new UpdateProfileAPI(updateProfileReqBody, id);
    dispatch(APITransport(apiObj));

    const mailObj = new ToggleMailsAPI(loggedInUser.id, !dailyEmail);
    dispatch(APITransport(mailObj));
  };

  return (
    <Grid display="flex" justifyContent="center" item xs={12} md={8}>
      <Tooltip
        title={`${dailyEmail ? "Disable" : "Enable"} daily mails`}
        sx={{ marginLeft: "0", marginTop: "8px" }}
      >
        <FormControlLabel
          control={<Switch color="primary" />}
          checked={dailyEmail}
          onChange={() => handleSwitchToggleEmail()}
          disabled={
            !(
              loggedInUser.id === +id ||
              loggedInUser.role === "ADMIN" ||
              loggedInUser.id === orgOwnerId
            )
          }
        />
      </Tooltip>
    </Grid>
  );
};

export default DailyEmailToggle;
