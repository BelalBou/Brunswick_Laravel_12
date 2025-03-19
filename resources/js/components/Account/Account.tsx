import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import userTypes from "../../utils/UserTypes/UserTypes";

const styles = (theme: Theme) =>
  createStyles({
    heroUnit: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: ".625rem"
    },
    layout: {
      width: "auto",
      margin: "0 auto"
    },
    gridContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    gridItem: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: theme.spacing.unit * 2
    },
    cardGrid: {
      padding: 0,
      [theme.breakpoints.up("md")]: {
        padding: theme.spacing.unit * 4
      }
    },
    main: {
      flex: 1
    },
    list: {
      [theme.breakpoints.up("md")]: {
        minWidth: "450px"
      }
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userFirstName: string;
  userLastName: string;
  userEmailAddress: string;
  userType: string;
  userLanguage: string;
  selected: number;
  dictionnaryList: any[];
  actions: any;
}

interface IState {
  userLanguage: string;
}

class Account extends Component<IProvidedProps & IProps, IState> {
  constructor(props: IProvidedProps & IProps) {
    super(props);
    this.state = {
      userLanguage: props.userLanguage
    };
  }

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.props.actions.getDictionnaries();
  };

  handleLogout = () => {
    this.props.actions.logout();
  };

  handleChangeUserLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.props.actions.editUserLanguage(value);
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      userObj.language = value;
      localStorage.setItem("user", JSON.stringify(userObj));
    }
    this.setState({ userLanguage: value });
  };

  handleChangeSelected = (selected: number) => {
    this.props.actions.setSelected(selected);
    localStorage.setItem("selected", selected.toString());
  };

  checkDictionnary = (define: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(define, dictionnaryList, userLanguage);
  };

  render() {
    const {
      isLoginSuccess,
      isListPending,
      userFirstName,
      userLastName,
      userEmailAddress,
      userLanguage,
      userType,
      selected,
      classes
    } = this.props;
    if (!isLoginSuccess) {
      return <Navigate to="/login" replace />;
    }
    return (
      <MenuBar
        isLoginSuccess={isLoginSuccess}
        isListPending={isListPending}
        userType={userType}
        selected={selected}
        title={this.checkDictionnary("_MON_COMPTE")}
        onLogout={this.handleLogout}
        onChangeSelected={this.handleChangeSelected}
        checkDictionnary={this.checkDictionnary}
      >
        <main className={classes.main}>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <div className={classes.heroUnit}>
              <Grid container className={classes.gridContainer}>
                <Grid item className={classes.gridItem}>
                  <Typography
                    variant="h4"
                    align="center"
                    color="textSecondary"
                    gutterBottom
                  >
                    {this.checkDictionnary("_DONNEES_PERSONNELLES")}
                  </Typography>
                  <List className={classes.list}>
                    <ListItem>
                      <ListItemText
                        primary={this.checkDictionnary("_NOM")}
                        secondary={
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            className="centered-text"
                          >
                            {userLastName.toUpperCase()}
                          </Typography>
                        }
                        classes={{
                          primary: "centered-text"
                        }}
                      />
                    </ListItem>
                    <Divider light />
                    <ListItem>
                      <ListItemText
                        primary={this.checkDictionnary("_PRENOM")}
                        secondary={
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            className="centered-text"
                          >
                            {userFirstName}
                          </Typography>
                        }
                        classes={{
                          primary: "centered-text"
                        }}
                      />
                    </ListItem>
                    <Divider light />
                    <ListItem>
                      <ListItemText
                        primary={this.checkDictionnary("_ADRESSE_EMAIL")}
                        secondary={
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            className="centered-text"
                          >
                            {userEmailAddress}
                          </Typography>
                        }
                        classes={{
                          primary: "centered-text"
                        }}
                      />
                    </ListItem>
                    <Divider light />
                    <ListItem>
                      <ListItemText
                        primary={this.checkDictionnary("_TYPE_DE_COMPTE")}
                        secondary={
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            className="centered-text"
                          >
                            {
                              userTypes.filter(x => x.value === userType)[0]
                                .label
                            }
                          </Typography>
                        }
                        classes={{
                          primary: "centered-text"
                        }}
                      />
                    </ListItem>
                    <Divider light />
                    <ListItem>
                      <ListItemText
                        primary={this.checkDictionnary("_LANGUE")}
                        secondary={
                          <Select
                            value={userLanguage}
                            onChange={this.handleChangeUserLanguage}
                          >
                            <MenuItem value="en">🇺🇸 English</MenuItem>
                            <MenuItem value="fr">🇫🇷 Français</MenuItem>
                          </Select>
                        }
                        classes={{
                          primary: "centered-text",
                          secondary: "centered-text"
                        }}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </div>
          </div>
        </main>
        <Footer />
      </MenuBar>
    );
  }
}

export default withStyles(styles)(Account);
