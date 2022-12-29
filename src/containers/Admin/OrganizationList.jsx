import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";

//Themes
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../theme/tableTheme";

//Components
import MUIDataTable from "mui-datatables";
import Search from "../../common/Search";

//APIs
import APITransport from "../../redux/actions/apitransport/apitransport";
import FetchOrganizationListAPI from "../../redux/actions/api/Organization/FetchOrganizationList";

const OrganizationList = () => {
  const dispatch = useDispatch();
  const orgList = useSelector((state) => state.getOrganizationList.data);

  useEffect(() => {
    const apiObj = new FetchOrganizationListAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const columns = [
    {
      name: "title",
      label: "Organization",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "organization_owner",
      label: "Organization Owner",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "created_by",
      label: "Created By",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
        customBodyRender: (value) => {
          return (
            <div style={{ textTransform: "none" }}>
              {moment(value).format("DD/MM/YYYY hh:mm:ss")}
            </div>
          );
        },
      },
    },
    {
      name: "email_domain_name",
      label: "Email Domain Name",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px", padding: "16px" },
        }),
      },
    },
    {
      name: "Action",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          style: { height: "30px", fontSize: "16px" },
        }),
      },
    },
  ];

  const options = {
    textLabels: {
      body: {
        noMatch: "No records",
      },
      toolbar: {
        search: "Search",
        viewColumns: "View Column",
      },
      pagination: { rowsPerPage: "Rows per page" },
      options: { sortDirection: "desc" },
    },
    displaySelectToolbar: false,
    fixedHeader: false,
    filterType: "checkbox",
    download: false,
    print: false,
    rowsPerPageOptions: [10, 25, 50, 100],
    filter: false,
    viewColumns: true,
    selectableRows: "none",
    search: false,
    jumpToPage: true,
  };

  return (
    <>
      <Search />
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable data={orgList} columns={columns} options={options} />
      </ThemeProvider>
    </>
  );
};

export default OrganizationList;
