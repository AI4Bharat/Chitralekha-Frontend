import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Themes
import { ThemeProvider, Tooltip, IconButton, Box } from "@mui/material";
import tableTheme from "../../theme/tableTheme";
import TableStyles from "../../styles/TableStyles";

//Components
import MUIDataTable from "mui-datatables";
import EditIcon from "@mui/icons-material/Edit";

//APIs
import FetchAllUsersAPI from "../../redux/actions/api/Admin/FetchAllUsers";
import APITransport from "../../redux/actions/apitransport/apitransport";
import { getColumns, getOptions } from "../../utils/tableUtils";
import { adminMemberListColumns } from "../../config/tableColumns";

const MemberList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = TableStyles();

  const userList = useSelector((state) => state.getAllUserList.data);
  const searchList = useSelector((state) => state.searchList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  useEffect(() => {
    const apiObj = new FetchAllUsersAPI();
    dispatch(APITransport(apiObj));
    // eslint-disable-next-line
  }, []);

  const pageSearch = () => {
    return userList?.filter((el) => {
      if (searchList === "") {
        return el;
      } else if (
        el.username?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (
        el.organization?.title
          ?.toLowerCase()
          .includes(searchList?.toLowerCase())
      ) {
        return el;
      } else if (el.email?.toLowerCase().includes(searchList?.toLowerCase())) {
        return el;
      } else if (
        el.role_label?.toLowerCase().includes(searchList?.toLowerCase())
      ) {
        return el;
      } else {
        return [];
      }
    });
  };

  const result =
    userList && userList.length > 0
      ? pageSearch().map((item, i) => {
          return [
            item.id,
            `${item.first_name} ${item.last_name}`,
            item.organization,
            item.email,
            item.role_label,
          ];
        })
      : [];

  const columns = getColumns(adminMemberListColumns);
  columns.push({
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      setCellHeaderProps: () => ({
        className: classes.cellHeaderProps,
      }),
      customBodyRender: (_value, tableMeta) => {
        return (
          <Box sx={{ display: "flex" }}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => navigate(`/profile/${tableMeta.rowData[0]}`)}
              >
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={result}
          columns={columns}
          options={getOptions(apiStatus.progress)}
        />
      </ThemeProvider>
    </>
  );
};

export default MemberList;
