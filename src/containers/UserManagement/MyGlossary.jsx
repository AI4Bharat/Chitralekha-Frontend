import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import MUIDataTable from "mui-datatables";
import {
  APITransport,
  CreateGlossaryAPI,
  DeleteGlossaryAPI,
  FetchGlossaryAPI,
  UploadGlossaryAPI,
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
import { DatasetStyle, TableStyles } from "styles";
import GlossaryDialog from "common/GlossaryDialog";
import UploadFileDialog from "common/UploadFileDialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Iso } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import GlossaryEditDialog from "common/GlossaryEditDialog";

const MyGlossary = () => {
  const classes = DatasetStyle();
  const tableClasses = TableStyles();

  const dispatch = useDispatch();

  const [openGlossaryDialog, setOpenGlossaryDialog] = useState(false);
  const [openGlossaryEditDialog, setOpenGlossaryEditDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState();
  const [openUploadGlossaryDialog, setOpenUploadGlossaryDialog] =
    useState(false);
  const [orgOwnerId, setOrgOwnerId] = useState("");

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
          setOpenGlossaryEditDialog(false);
          getGlossaryList();
        }

        if (apiType === "UPLOAD_GLOSSARY") {
          getGlossaryList();
          setOpenUploadGlossaryDialog(false);
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    getGlossaryList();

    // eslint-disable-next-line
  }, []);
  const [isUserOrgOwner, setIsUserOrgOwner] = useState(false);

  useEffect(() => {
    if (loggedInUserData && loggedInUserData.id) {
     const {
      organization: { organization_owners },
    } = loggedInUserData;

    if (organization_owners && organization_owners.length > 0) {
      const ownerIds = organization_owners.map(owner => owner.id);
      setOrgOwnerId(ownerIds);

      if (ownerIds.includes(loggedInUserData.id)) {
        setIsUserOrgOwner(true);
      } else {
        setIsUserOrgOwner(false);
      }
    }
    }
  }, [loggedInUserData]);

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

  const handleEditGlossary = (rowData) => {
    setSelectedRowData(rowData);
    setOpenGlossaryEditDialog(true);
  };

  const actionColumn = {
    name: "Action",
    label: "Actions",
    options: {
      filter: false,
      sort: false,
      align: "center",
      setCellHeaderProps: () => ({
        className: tableClasses.cellHeaderProps,
      }),
      customBodyRender: (_value, tableMeta) => {
        const { tableData: data, rowIndex } = tableMeta;
        const selectedRow = data[rowIndex];

        return (
          <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEditGlossary(selectedRow)}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteGlossary(selectedRow)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
        </>
        );
      },
    },
  };

  const columns = [...getColumns(glossaryColumns), actionColumn];

  const uploadGlossary = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const csvData = reader.result;
      const csv = btoa(csvData);

      const { organization } = loggedInUserData;

      const payload = {
        org_id: organization.id,
        csv,
      };

      const apiObj = new UploadGlossaryAPI(payload);
      dispatch(APITransport(apiObj));
    };
    reader.readAsBinaryString(file[0]);
  };

  const handleSampleDownload = (event) => {
    event.stopPropagation();

    const link = document.createElement("a");

    link.href = "expected_glossary_input.csv";
    link.download = "expected_glossary_input.csv";

    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Card className={classes.workspaceCard}>
        <Typography variant="h2" gutterBottom>
          My Glossary
        </Typography>

        <Grid container direction="row" sx={{ my: 4 }}>
          <Grid
            item
            md={  
              isUserOrgOwner ||
              loggedInUserData?.role==="ADMIN"||
              loggedInUserData.role === "PROJECT_MANAGER"
                ? 6
                : 12
            }
            xs={12}
          >
            <Button
              style={{ marginRight: "10px", width: "100%" }}
              variant="contained"
              onClick={() => setOpenGlossaryDialog(true)}
            >
              Add New Glossary
            </Button>
          </Grid>

          {(isUserOrgOwner || loggedInUserData?.role==="ADMIN"||

            loggedInUserData.role === "PROJECT_MANAGER") && (
            <Grid item md={6} xs={12}>
              <Button
                style={{ marginLeft: "10px", width: "100%" }}
                variant="contained"
                onClick={() => setOpenUploadGlossaryDialog(true)}
              >
                Upload Glossary
                <Tooltip title="Download sample CSV">
                  <IconButton
                    onClick={(e) => handleSampleDownload(e)}
                    sx={{ color: "white" }}
                  >
                    <InfoOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Button>
            </Grid>
          )}
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
            acceptTaskIds={true}
          />
        )}

        {openGlossaryEditDialog && (
          <GlossaryEditDialog
            openDialog={openGlossaryEditDialog}
            handleClose={() => setOpenGlossaryEditDialog(false)}
            submit={(sentences) => createGlossary(sentences)}
            title={"Edit Glossary"}
            selectedRow={selectedRowData}
          />
        )}

        {openUploadGlossaryDialog && (
          <UploadFileDialog
            openDialog={openUploadGlossaryDialog}
            handleClose={() => setOpenUploadGlossaryDialog(false)}
            title={"Upload Glossary"}
            handleSubmit={uploadGlossary}
          />
        )}
      </Card>
    </Grid>
  );
};

export default MyGlossary;
