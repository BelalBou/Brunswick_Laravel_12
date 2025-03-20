import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { alpha } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(4),
    width: "auto"
  },
  "& .MuiInputBase-root": {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    color: "#fff"
  }
}));

const StyledIcon = styled('span')(({ theme }) => ({
  color: "#fff",
  marginLeft: theme.spacing(2)
}));

interface IProps {
  onSearch: (search: string) => void;
  checkDictionnary: (tag: string) => string;
}

const SearchBar: React.FC<IProps> = ({ onSearch, checkDictionnary }) => {
  const [search, setSearch] = useState("");

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <StyledTextField
      id="input-with-icon-textfield"
      value={search}
      onChange={handleChangeSearch}
      placeholder={checkDictionnary("_RECHERCHE")}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon component={StyledIcon} />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClearSearch}>
              <ClearIcon sx={{ color: "#fff" }} />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchBar;
