//My Organization

import { Box} from "@mui/material";
import Header from "../../common/Header";
import ProjectStyle from "../../styles/ProjectStyle";
import OrganizationList from "./OrganizationList";




const MyOrganization = () => {
  const classes = ProjectStyle();

  return (
    <>
      <Header />
      <div className={classes.container}>
        <Box>
        <OrganizationList />
          
          
        
        </Box>

      </div>
    </>
  );
};

export default MyOrganization;
