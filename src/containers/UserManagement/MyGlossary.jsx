import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import MUIDataTable from "mui-datatables";
import {
  APITransport,
  CreateGlossaryAPI,
  DeleteGlossaryAPI,
  FetchGlossaryAPI,
} from "redux/actions";
import { glossaryColumns } from "config";
import {
  Button,
  Card,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatasetStyle } from "styles";
import GlossaryDialog from "common/GlossaryDialog";

const MyGlossary = () => {
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  const [openGlossaryDialog, setOpenGlossaryDialog] = useState(false);

  const apiStatus = useSelector((state) => state.apiStatus);
  const glossaryList = useSelector((state) => state.getGlossary.data?.tmx_keys);
  const loggedInUserData = useSelector(
    (state) => state.getLoggedInUserDetails.data
  );

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

        if (apiType === "CREATE_GLOSSARY") {
          setOpenGlossaryDialog(false);
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

  const createGlossary = (sentences) => {
    const userId = loggedInUserData.id;

    const apiObj = new CreateGlossaryAPI(userId, sentences);
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
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom>
          My Glossary
        </Typography>

        <Grid container direction="row" sx={{ my: 4 }}>
          <Grid item md={6} xs={12}>
            <Button
              style={{ marginRight: "10px", width: "100%" }}
              variant="contained"
              onClick={() => setOpenGlossaryDialog(true)}
            >
              Add New Glossary
            </Button>
          </Grid>
          <Grid item md={6} xs={12}>
            <Button
              style={{ marginLeft: "10px", width: "100%" }}
              variant="contained"
            >
              Upload Glossary
            </Button>
          </Grid>
        </Grid>

        <MUIDataTable
          data={glossaryList}
          columns={columns}
          options={getOptions(apiStatus.loading)}
        />

        {openGlossaryDialog && (
          <GlossaryDialog
            openDialog={openGlossaryDialog}
            handleClose={() => setOpenGlossaryDialog(false)}
            submit={(sentences) => createGlossary(sentences)}
            title={"Add Glossary"}
            disableFields={false}
          />
        )}
      </Card>
    </Grid>
  );
};

export default MyGlossary;
