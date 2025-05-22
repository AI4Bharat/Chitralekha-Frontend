import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getColumns, getOptions } from "utils";
import { Link, useParams } from "react-router-dom";
import { projectColumns } from "config";

//Themes
import { tableTheme } from "theme";

//Icons
import PreviewIcon from "@mui/icons-material/Preview";

//Components
import { ThemeProvider, Tooltip, IconButton } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { DeleteDialog } from "common";

//APIs
import DeleteProjectAPI from "redux/actions/api/Project/DeleteProject";
import { APITransport } from "redux/actions";

const ProjectList = ({ data, removeProjectList }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [projectid, setprojectid] = useState([]);
  const [open, setOpen] = useState(false);
  const [orgOwnerId, setOrgOwnerId] = useState("");
  const [isUserOrgOwner, setIsUserOrgOwner] = useState(false);
const [loading,setloading] = useState(false)
  const apiStatus = useSelector((state) => state.apiStatus);
  const userData = useSelector((state) => state.getLoggedInUserDetails.data);

  useEffect(() => {
    if (userData && userData.id) {
      const {
        organization: { organization_owners },
      } = userData;
  
      if (organization_owners && organization_owners?.length > 0) {
        const ownerIds = organization_owners.map(owner => owner.id);
        setOrgOwnerId(ownerIds);
  
        if (ownerIds.includes(userData.id)) {
          setIsUserOrgOwner(true);
        } else {
          setIsUserOrgOwner(false);
        }
      }
    }
    // eslint-disable-next-line
  }, [userData]);
  useEffect(() => {
    const { progress, success, apiType } = apiStatus;
if(progress){
  if (apiType === "GET_PROJECT_LIST"){
          setloading(true)
        }
}
    if (!progress) {
      if (success) {
        if (apiType === "DELETE_Project") {
          removeProjectList();
        }
        if (apiType === "GET_PROJECT_LIST"){
          setloading(false)
        }
      }
      setOpen(false);
    }

    // eslint-disable-next-line
  }, [apiStatus]);

  const handleok = async (id) => {
    const apiObj = new DeleteProjectAPI(id);
    dispatch(APITransport(apiObj));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteProject = (id) => {
    setOpen(true);
    setprojectid(id);
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
          <div style={{ 
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            }}>
            <Link
              to={`/my-organization/${id}/project/${selectedRow.id}`}
              style={{ textDecoration: "none" }}
            >
              <Tooltip title="View">
                <IconButton>
                  <PreviewIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Link>

          </div>
        );
      },
    },
  };

  const columns = [...getColumns(projectColumns), actionColumn];

  return (
    <>
      <ThemeProvider theme={tableTheme}>
        <MUIDataTable
          data={data}
          columns={columns}
          options={getOptions(apiStatus.loading)}
        />
      </ThemeProvider>

      {open && (
        <DeleteDialog
          openDialog={open}
          handleClose={() => handleClose()}
          submit={() => handleok(projectid)}
          loading={apiStatus.loading}
          message={`Are you sure, you want to delete this project? All the associated
          video and tasks will be deleted.`}
        />
      )}
    </>
  );
};

export default ProjectList;
