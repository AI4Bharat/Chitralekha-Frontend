import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import MUIDataTable from "mui-datatables";
import { APITransport, FetchGlossaryAPI } from "redux/actions";
import { glossaryColumns } from "config";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MyGlossary = () => {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);
  const glossaryList = useSelector((state) => state.getGlossary.data?.tmx_keys);

  useEffect(() => {
    const apiObj = new FetchGlossaryAPI();
    dispatch(APITransport(apiObj));
  }, []);

  const handleDeleteGlossary = () => { };

  const actionColumn = {
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      customBodyRender: (_value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedRow = data[rowIndex];

        return (
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDeleteGlossary(selectedRow.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </Tooltip>
        );
      },
    },
  };

  const columns = [...getColumns(glossaryColumns), actionColumn];

  return (
    <div>
      <MUIDataTable
        data={glossaryList}
        columns={columns}
        options={getOptions(apiStatus.loading)}
      />
    </div>
  );
};

export default MyGlossary;
