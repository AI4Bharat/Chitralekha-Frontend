//My Organization

import { Box } from "@mui/material";
import { useEffect } from "react";
import OrganizationListAPI from "../../redux/actions/api/Organization/OrganizationList";
import OrganizationList from "./OrganizationList";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { useDispatch } from "react-redux";

const MyOrganization = () => {
  const dispatch = useDispatch();

  const getOrganizationList = () => {
    const userObj = new OrganizationListAPI();
    console.log(userObj,'userObj');
    dispatch(APITransport(userObj));
  };

  useEffect(() => {
    getOrganizationList();
  }, [])
  
  return (
    <>
      <Box>
        <OrganizationList />
      </Box>
    </>
  );
};

export default MyOrganization;
