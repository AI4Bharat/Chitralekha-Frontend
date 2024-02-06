import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import MUIDataTable from "mui-datatables";
import {
  APITransport,
  DeleteGlossaryAPI,
  FetchGlossaryAPI,
} from "redux/actions";
import { glossaryColumns } from "config";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MyGlossary = () => {
  const dispatch = useDispatch();
  const apiStatus = useSelector((state) => state.apiStatus);
  const glossaryList = useSelector((state) => state.getGlossary.data?.tmx_keys);

  const getGlossaryList = () => {
    const apiObj = new FetchGlossaryAPI();
    dispatch(APITransport(apiObj));
  };

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "DELETE_GLOSSARY") {
          getGlossaryList();
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    getGlossaryList();

    // eslint-disable-next-line
  }, []);

  const handleDeleteGlossary = (rowData) => {
    const { source_text, source_language, target_language, target_text } =
      rowData;

    const sentences = [
      {
        src: source_text,
        locale: `${source_language}|${target_language}`,
        tgt: target_text,
      },
    ];

    const apiObj = new DeleteGlossaryAPI(sentences);
    dispatch(APITransport(apiObj));
  };

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
            <IconButton onClick={() => handleDeleteGlossary(selectedRow)}>
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
