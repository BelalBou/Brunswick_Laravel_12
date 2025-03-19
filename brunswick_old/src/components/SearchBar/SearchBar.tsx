import React from "react";
import classNames from "classnames";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";

const styles = (theme: Theme) =>
  createStyles({
    textField: {
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing.unit * 4,
        width: "auto"
      }
    },
    input: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      color: "#fff"
    },
    icon: {
      color: "#fff"
    },
    searchIcon: {
      marginLeft: theme.spacing.unit * 2
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  onSearch: (search: string) => void;
  checkDictionnary: (tag: string) => string;
}

class SearchBar extends React.Component<IProvidedProps & IProps> {
  state = {
    search: ""
  };

  handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      search: value
    });
    this.props.onSearch(value);
  };

  handleClearSearch = () => {
    this.setState({
      search: ""
    });
    this.props.onSearch("");
  };

  render() {
    const { classes } = this.props;
    const { search } = this.state;
    return (
      <TextField
        className={classes.textField}
        id="input-with-icon-textfield"
        value={search}
        onChange={this.handleChangeSearch}
        placeholder={this.props.checkDictionnary("_RECHERCHE")}
        InputProps={{
          disableUnderline: true,
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                className={classNames(classes.icon, classes.searchIcon)}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={this.handleClearSearch}>
                <ClearIcon className={classes.icon} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    );
  }
}

export default withStyles(styles)(SearchBar);
