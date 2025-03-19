import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import emailValidator from "email-validator";
import { Theme, createStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Snackbar from "../Snackbar/Snackbar";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";

const styles = (theme: Theme) =>
  createStyles({
    main: {
      width: "auto",
      display: "block", // Fix IE 11 issue.
      marginLeft: theme.spacing.unit * 3,
      marginRight: theme.spacing.unit * 3,
      [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    paper: {
      marginTop: theme.spacing.unit * 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
        .spacing.unit * 3}px`
    },
    avatar: {
      margin: theme.spacing.unit,
      backgroundColor: theme.palette.primary.main
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing.unit
    },
    submit: {
      marginTop: theme.spacing.unit * 3
    },
    margin: {
      margin: theme.spacing.unit
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  isLoginPending: boolean;
  isLoginSuccess: boolean;
  loginError: string;
  isListPending: boolean;
  isEditPending: boolean;
  isEditSuccess: boolean;
  editError: string;
  userLanguage: string;
  dictionnaryList: any[];
  actions: any;
  match: any;
}

interface IState {
  emailAddress: string;
  password: string;
  confirmPassword: string;
  openLogin: boolean;
  openEdit: boolean;
  openReset: boolean;
  register: boolean;
  validated: boolean;
  resetPassword: boolean;
}

class Login extends Component<IProvidedProps & IProps, IState> {
  private passwordRegExp = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;

  state = {
    emailAddress: "",
    password: "",
    confirmPassword: "",
    openLogin: false,
    openEdit: false,
    openReset: false,
    register: false,
    validated: true,
    resetPassword: false
  };

  componentDidMount() {
    const { match } = this.props;
    const token = match.params.id;
    if (token) {
      this.logout_and_edit(token);
    }
    this.props.actions.getDictionnaries();
  }

  logout_and_edit = async (token:any) => {
    this.props.actions.editToken(token);
    this.setState({
      register: true
    });
  };

  handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      emailAddress: value.trim().toLowerCase()
    });
  };

  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      password: value
    });
  };

  handleChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    this.setState({
      confirmPassword: value
    });
  };

  handleChangeResetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(state => {
      return {
        resetPassword: !state.resetPassword
      };
    });   
  };

  handleCloseLogin = () => {
    this.setState({
      openLogin: false
    });
  };

  handleCloseEdit = () => {
    this.setState({
      openEdit: false
    });
  };

  handleCloseReset = () => {
    this.setState({
      openReset: false
    });
  };

  handleLogin = () => {
    const { emailAddress, password } = this.state;
    if (emailValidator.validate(emailAddress) && password) {
      this.props.actions.login(emailAddress, password);
      this.setState({
        openLogin: true
      });
    } else {
      this.setState({
        validated: false
      });
    }
  };

  handleKeyPressLogin = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    if (key === "Enter") {
      this.handleLogin();
    }
  };

  handleRegister = () => {
    const { password, confirmPassword } = this.state;
    if (
      password &&
      confirmPassword &&
      password === confirmPassword &&
      this.passwordRegExp.test(password) &&
      this.passwordRegExp.test(confirmPassword)
    ) {
      this.props.actions.register(password, confirmPassword);
      this.setState({
        openEdit: true,
        register: false,
        validated: true,
        password: "",
        confirmPassword: ""
      });
    } else {
      this.setState({
        validated: false
      });
    }
  };

  handleKeyPressRegister = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    if (key === "Enter") {
      this.handleRegister();
    }
  };

  handleResetPassword = () => {
    const { emailAddress } = this.state;
    if (emailValidator.validate(emailAddress)) {
      this.props.actions.resetPassword(emailAddress);
      this.setState({
        openReset: true
      });
    } else {
      this.setState({
        validated: false
      });
    }
  };

  checkDictionnary = (tag: string) => {
    const { dictionnaryList, userLanguage } = this.props;
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  render() {
    const {
      isLoginPending,
      isLoginSuccess,
      loginError,
      isListPending,
      isEditPending,
      isEditSuccess,
      editError,
      classes
    } = this.props;
    const {
      emailAddress,
      password,
      confirmPassword,
      openLogin,
      openEdit,
      openReset,
      register,
      validated,
      resetPassword
    } = this.state;
    if (isLoginSuccess) {
      return <Redirect to="/menus" />;
    }
    return (
      <>
        {(isLoginPending || isListPending || isEditPending) && (
          <LinearProgress />
        )}
        {isEditSuccess && openEdit && (
          <Snackbar
            variant="success"
            className={classes.margin}
            message={this.checkDictionnary(
              "_VOUS_POUVEZ_DESORMAIS_VOUS_CONNECTER"
            )}
            onClose={this.handleCloseEdit}
          />
        )}
        {isEditSuccess && openReset && (
          <Snackbar
            variant="success"
            className={classes.margin}
            message={this.checkDictionnary(
              "_DEMANDE_DE_REINITIALISATION_ENVOYEE"
            )}
            onClose={this.handleCloseReset}
          />
        )}
        {loginError && openLogin && (
          <Snackbar
            variant="error"
            className={classes.margin}
            message={this.checkDictionnary(
              "_NOUS_NE_PARVENONS_PAS_A_VOUS_CONNECTER"
            )}
            onClose={this.handleCloseLogin}
          />
        )}
        {editError && openEdit && (
          <Snackbar
            variant="error"
            className={classes.margin}
            message={this.checkDictionnary(
              "_NOUS_NE_PARVENONS_PAS_A_VOUS_ENREGISTRER"
            )}
            onClose={this.handleCloseEdit}
          />
        )}
        {editError && openReset && (
          <Snackbar
            variant="error"
            className={classes.margin}
            message={this.checkDictionnary(
              "_NOUS_NE_PARVENONS_PAS_A_VOUS_REINITIALISER"
            )}
            onClose={this.handleCloseReset}
          />
        )}
        <main className={classes.main}>
          <Paper className={classes.paper}>
            {!isListPending && (
              <>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography
                  component="h1"
                  variant="h5"
                  className="centered-text"
                >
                  Brunswick · {this.checkDictionnary("_PORTAIL_COMMANDE")}
                </Typography>
                <form className={classes.form}>
                  {!register && (
                    <>
                      <FormControl
                        margin="normal"
                        required
                        error={
                          !emailValidator.validate(emailAddress) && !validated
                        }
                        fullWidth
                      >
                        <InputLabel htmlFor="email">
                          {this.checkDictionnary("_ADRESSE_EMAIL")}
                        </InputLabel>
                        <Input
                          id="email"
                          name="email"
                          autoComplete="email"
                          autoFocus
                          value={emailAddress}
                          onChange={this.handleChangeEmailAddress}
                        />
                      </FormControl>
                      <FormControl
                        margin="normal"
                        required
                        error={!password && !validated}
                        fullWidth
                      >
                        <InputLabel htmlFor="password">
                          {this.checkDictionnary("_MOT_DE_PASSE")}
                        </InputLabel>
                        <Input
                          name="password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={this.handleChangePassword}
                          onKeyPress={this.handleKeyPressLogin}
                        />
                      </FormControl>
                    </>
                  )}
                  {register && (
                    <>
                      <FormControl
                        margin="normal"
                        required
                        error={
                          (!password ||
                            password !== confirmPassword ||
                            !this.passwordRegExp.test(password)) &&
                          !validated
                        }
                        fullWidth
                      >
                        <InputLabel htmlFor="newPassword">
                          {this.checkDictionnary("_CREER_MOT_DE_PASSE")}
                        </InputLabel>
                        <Input
                          name="password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={this.handleChangePassword}
                        />
                        {!this.passwordRegExp.test(password) && !validated && (
                          <FormHelperText id="component-error-text">
                            {this.checkDictionnary("_VOTRE_MOT_DE_PASSE_DOIT")}
                            <ul>
                              <li>{this.checkDictionnary("_6_CARS")}</li>
                              <li>{this.checkDictionnary("_DONT_MAJ")}</li>
                              <li>{this.checkDictionnary("_UNE_MIN")}</li>
                              <li>{this.checkDictionnary("_ET_NOMBRE")}</li>
                            </ul>
                          </FormHelperText>
                        )}
                      </FormControl>
                      <FormControl
                        margin="normal"
                        required={!resetPassword}
                        error={
                          (!confirmPassword ||
                            confirmPassword !== password ||
                            !this.passwordRegExp.test(confirmPassword)) &&
                          !validated
                        }
                        fullWidth
                      >
                        <InputLabel htmlFor="confirmPassword">
                          {this.checkDictionnary("_CONFIRMER_MOT_DE_PASSE")}
                        </InputLabel>
                        <Input
                          name="confirmPassword"
                          type="password"
                          id="confirmPassword"
                          autoComplete="current-password"
                          value={confirmPassword}
                          onChange={this.handleChangeConfirmPassword}
                          onKeyPress={this.handleKeyPressRegister}
                        />
                        {!this.passwordRegExp.test(confirmPassword) &&
                          !validated && (
                            <FormHelperText id="component-error-text">
                              {this.checkDictionnary(
                                "_VOTRE_MOT_DE_PASSE_DOIT"
                              )}
                              <ul>
                                <li>{this.checkDictionnary("_6_CARS")}</li>
                                <li>{this.checkDictionnary("_DONT_MAJ")}</li>
                                <li>{this.checkDictionnary("_UNE_MIN")}</li>
                                <li>{this.checkDictionnary("_ET_NOMBRE")}</li>
                              </ul>
                            </FormHelperText>
                          )}
                      </FormControl>
                    </>
                  )}
                  {!register && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={resetPassword}
                          color="primary"
                          onChange={this.handleChangeResetPassword}
                        />
                      }
                      label="Je souhaite réinitialiser mon mot de passe"
                    />
                  )}
                  {!register && !resetPassword && (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={this.handleLogin}
                    >
                      {this.checkDictionnary("_SE_CONNECTER")}
                    </Button>
                  )}
                  {!register && resetPassword && (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={this.handleResetPassword}
                    >
                      {this.checkDictionnary("_REINITIALISER")}
                    </Button>
                  )}
                  {register && !resetPassword && (
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={this.handleRegister}
                    >
                      {this.checkDictionnary("_VALIDER")}
                    </Button>
                  )}
                </form>
              </>
            )}
          </Paper>
        </main>
      </>
    );
  }
}

export default withStyles(styles)(Login);
