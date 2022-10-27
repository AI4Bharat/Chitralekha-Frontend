//My Organization

import { Box } from "@mui/material";
import { useEffect } from "react";
import FetchOrganizationDetailsAPI from "../../redux/actions/api/Organization/FetchOrganizationDetails";
import ProjectListAPI from "../../redux/actions/api/Organization/ProjectList";
import OrganizationList from "./OrganizationList";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { useDispatch } from "react-redux";

const MyOrganization = () => {
  const dispatch = useDispatch();

  const getOrganizationDetails = () => {
    const userObj = new FetchOrganizationDetailsAPI();
    dispatch(APITransport(userObj));
  };

  const getProjectList = () => {
    const userObj = new ProjectListAPI();
    dispatch(APITransport(userObj));
  }

  useEffect(() => {
    getOrganizationDetails();
    getProjectList();
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
