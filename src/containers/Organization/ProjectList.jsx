import React from "react";

//Themes
import { ThemeProvider } from "@mui/material";
import tableTheme from "../../theme/tableTheme";

//Components
import CustomButton from "../../common/Button";
import MUIDataTable from "mui-datatables";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const ProjectList = ({ data,props }) => {
  const { id } = useParams();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const result = data.map((item) => {
      return [
        item.title,
        item.manager?.username,
        item.created_by?.username,
        <Link
          to={`/my-organization/${id}/project/${item.id}`}
          style={{ textDecoration: "none" }}
        > 
          <CustomButton sx={{ borderRadius: 2, marginRight: 2 }} label="View" />
        </Link>,
      ];
    });

    setTableData(result);
  }, [data]);

  const columns = [
    {
      name: "title",
      label: "Name",
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
      name: "Manager",
      label: "Manager",
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
      name: "createdBy",
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
      name: "Action",
      label: "Action",
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
    <ThemeProvider theme={tableTheme}>
      <MUIDataTable data={tableData} columns={columns} options={options} />
    </ThemeProvider>
  );
};

export default ProjectList;
