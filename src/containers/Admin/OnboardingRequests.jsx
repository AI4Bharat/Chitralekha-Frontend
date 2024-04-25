import React, { useCallback, useEffect, useState } from "react";
import { tableTheme } from "theme";
import { getColumns, getOptions } from "utils";
import { onBoardingRequestColumns, onBoardingTableActionBtns } from "config";
import { TableStyles } from "styles";

import { Box, IconButton, ThemeProvider, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { EditOnBoardingFormDialog, NotesDialog } from "common";
import {
  APITransport,
  FetchOnboardingListAPI,
  UpdateOnboardingFormAPI,
} from "redux/actions";
import { useDispatch, useSelector } from "react-redux";

const OnboardingRequests = () => {
  const classes = TableStyles();
  const dispatch = useDispatch();

  const [notes, setNotes] = useState("");
  const [openNotesPopup, setOpenNotesPopup] = useState(false);
  const [openOnboardingForm, setOpenOnboardingForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [selectedRowStatus, setSelectedRowStatus] = useState("");

  const onboardingList = useSelector((state) => state.getOnboardingList.data);
  const apiStatus = useSelector((state) => state.apiStatus);

  const getOnboardingList = useCallback(() => {
    const apiObj = new FetchOnboardingListAPI();
    dispatch(APITransport(apiObj));
  }, [dispatch]);

  useEffect(() => {
    const { progress, success, apiType } = apiStatus;

    if (!progress) {
      if (success) {
        if (apiType === "UPDATE_ONBOARDING_FORM") {
          getOnboardingList();
        }
      }
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  useEffect(() => {
    getOnboardingList();
  }, [getOnboardingList, dispatch]);

  const handleActionBtnClick = (item, data) => {
    if (item.key === "edit") {
      setOpenOnboardingForm(true);
      setSelectedRowData(data);
    } else {
      setNotes(item.notesText);
      setSelectedRowStatus(item.notesText);
      setOpenNotesPopup(true);
    }
  };

  const initColumns = () => {
    const actionColumn = {
      name: "Action",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        align: "center",
        setCellHeaderProps: () => ({
          className: classes.cellHeaderProps,
        }),
        customBodyRender: (_value, tableMeta) => {
          const { tableData: data, rowIndex } = tableMeta;
          const selectedTask = data[rowIndex];

          return (
            <Box sx={{ display: "flex" }}>
              {onBoardingTableActionBtns.map((item) => {
                return (
                  <Tooltip key={item.key} title={item.tooltipText}>
                    <IconButton
                      onClick={() => handleActionBtnClick(item, selectedTask)}
                    >
                      {item.icon}
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Box>
          );
        },
      },
    };

    const columns = [...getColumns(onBoardingRequestColumns)];
    columns.splice(7, 0, actionColumn);

    return columns;
  };

  const handleSubmit = () => {
    const payload = {
      status: selectedRowStatus,
      notes,
    };

    const apiObj = new UpdateOnboardingFormAPI(selectedRowData.id, payload);
    dispatch(APITransport(apiObj));
  };

  const handleEditPopupClose = () => {
    setOpenOnboardingForm(false);
    getOnboardingList();
  };

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={onboardingList}
          columns={initColumns()}
          options={getOptions()}
        />
      </ThemeProvider>

      {openNotesPopup && (
        <NotesDialog
          open={openNotesPopup}
          handleClose={() => setOpenNotesPopup(false)}
          text={notes}
          setText={setNotes}
          handleSubmit={handleSubmit}
        />
      )}

      {openOnboardingForm && (
        <EditOnBoardingFormDialog
          open={openOnboardingForm}
          handleClose={handleEditPopupClose}
          formData={selectedRowData}
        />
      )}
    </>
  );
};

export default OnboardingRequests;
