import { InputBase, ThemeProvider, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import themeDefault from "../theme/tableTheme";
import DatasetStyle from "../styles/Dataset";
import { useDispatch, useSelector } from "react-redux";
import SearchList from "../redux/actions/api/Project/Search";

const Search = (props) => {
  const ref = useRef(null);
  const classes = DatasetStyle();
  const dispatch = useDispatch();

  //const SearchProject = useSelector((state) => state.searchList.data);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (ref) ref.current.focus();
  }, [ref]);

  useEffect(() => {
    dispatch(SearchList(""));
  }, []);

  const handleChangeName = (value) => {
    setSearchValue(value);
    dispatch(SearchList(value));
  };

  return (
    <Grid container justifyContent="end" sx={{ marginTop: "0px", width: "auto", mb: "12px" }}>
      <Grid className={classes.search}>
        <Grid className={classes.searchIcon}>
          <SearchIcon fontSize="small" />
        </Grid>
        <InputBase
          sx={{ ml: 4 }}
          inputRef={ref}
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => handleChangeName(e.target.value)}
          inputProps={{ "aria-label": "search" }}
        />
      </Grid>
    </Grid>
  );
};

export default Search;
