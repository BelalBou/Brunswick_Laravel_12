import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { RootState, AppDispatch } from "../../types/redux";
import { login, register, resetPassword, editToken } from "../../actions/login";
import { getDictionnaries } from "../../actions/dictionnary";

const styles = (theme: Theme) =>
  createStyles({
    main: {
      width: "auto",
      display: "block",
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
        width: 400,
        marginLeft: "auto",
        marginRight: "auto"
      }
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1)
    },
    submit: {
      marginTop: theme.spacing(3)
    },
    margin: {
      margin: theme.spacing(1)
    }
  });

interface IProvidedProps {
  classes: any;
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

const Login = ({ classes }: IProvidedProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: token } = useParams();
  const {
    isLoginPending,
    isLoginSuccess,
    loginError,
    isListPending,
    isEditPending,
    isEditSuccess,
    editError,
    userLanguage,
    dictionnaryList
  } = useSelector((state: RootState) => ({
    isLoginPending: state.login.isLoginPending,
    isLoginSuccess: state.login.isLoginSuccess,
    loginError: state.login.loginError,
    isListPending: state.list.isListPending,
    isEditPending: state.edit.isEditPending,
    isEditSuccess: state.edit.isEditSuccess,
    editError: state.edit.editError,
    userLanguage: state.user.language,
    dictionnaryList: state.dictionnary.list
  }));

  const [state, setState] = React.useState<IState>({
    emailAddress: "",
    password: "",
    confirmPassword: "",
    openLogin: false,
    openEdit: false,
    openReset: false,
    register: false,
    validated: true,
    resetPassword: false
  });

  React.useEffect(() => {
    if (token) {
      logout_and_edit(token);
    }
    dispatch(getDictionnaries());
  }, [token, dispatch]);

  const logout_and_edit = async (token: string) => {
    dispatch(editToken(token));
    setState(prev => ({
      ...prev,
      register: true
    }));
  };

  const handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setState(prev => ({
      ...prev,
      emailAddress: value.trim().toLowerCase()
    }));
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setState(prev => ({
      ...prev,
      password: value
    }));
  };

  const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setState(prev => ({
      ...prev,
      confirmPassword: value
    }));
  };

  const handleChangeResetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      resetPassword: !prev.resetPassword
    }));
  };

  const handleCloseLogin = () => {
    setState(prev => ({
      ...prev,
      openLogin: false
    }));
  };

  const handleCloseEdit = () => {
    setState(prev => ({
      ...prev,
      openEdit: false
    }));
  };

  const handleCloseReset = () => {
    setState(prev => ({
      ...prev,
      openReset: false
    }));
  };

  const handleLogin = () => {
    const { emailAddress, password } = state;
    if (emailValidator.validate(emailAddress) && password) {
      dispatch(login(emailAddress, password));
      setState(prev => ({
        ...prev,
        openLogin: true
      }));
    } else {
      setState(prev => ({
        ...prev,
        validated: false
      }));
    }
  };

  const handleKeyPressLogin = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    if (key === "Enter") {
      handleLogin();
    }
  };

  const handleRegister = () => {
    const { password, confirmPassword } = state;
    if (
      password &&
      confirmPassword &&
      password === confirmPassword &&
      /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(password) &&
      /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(confirmPassword)
    ) {
      dispatch(register(password, confirmPassword));
      setState(prev => ({
        ...prev,
        openEdit: true,
        register: false,
        validated: true,
        password: "",
        confirmPassword: ""
      }));
    } else {
      setState(prev => ({
        ...prev,
        validated: false
      }));
    }
  };

  const handleKeyPressRegister = (event: React.KeyboardEvent<HTMLElement>) => {
    const { key } = event;
    if (key === "Enter") {
      handleRegister();
    }
  };

  const handleResetPassword = () => {
    const { emailAddress } = state;
    if (emailValidator.validate(emailAddress)) {
      dispatch(resetPassword(emailAddress));
      setState(prev => ({
        ...prev,
        openReset: true
      }));
    } else {
      setState(prev => ({
        ...prev,
        validated: false
      }));
    }
  };

  const checkDictionnary = (tag: string) => {
    return checkDictionnary(tag, dictionnaryList, userLanguage);
  };

  if (isLoginSuccess) {
    return <Navigate to="/menus" replace />;
  }

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
  } = state;

  return (
    <>
      <main className={classes.main}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {checkDictionnary("login")}
          </Typography>
          <form className={classes.form} noValidate>
            <FormControl margin="normal" required>
              <InputLabel htmlFor="email">
                {checkDictionnary("email")}
              </InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={emailAddress}
                onChange={handleChangeEmailAddress}
                onKeyPress={handleKeyPressLogin}
              />
            </FormControl>
            <FormControl margin="normal" required>
              <InputLabel htmlFor="password">
                {checkDictionnary("password")}
              </InputLabel>
              <Input
                name="password"
                type={resetPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleChangePassword}
                onKeyPress={handleKeyPressLogin}
              />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={resetPassword}
                  onChange={handleChangeResetPassword}
                />
              }
              label={checkDictionnary("show_password")}
            />
            {!validated && (
              <FormHelperText error>
                {checkDictionnary("invalid_email_password")}
              </FormHelperText>
            )}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleLogin}
              disabled={isLoginPending}
            >
              {isLoginPending ? (
                <LinearProgress />
              ) : (
                checkDictionnary("login")
              )}
            </Button>
          </form>
        </Paper>
      </main>
      <Snackbar
        open={openLogin}
        onClose={handleCloseLogin}
        message={loginError}
      />
      <Snackbar
        open={openEdit}
        onClose={handleCloseEdit}
        message={editError}
      />
      <Snackbar
        open={openReset}
        onClose={handleCloseReset}
        message={checkDictionnary("reset_password_sent")}
      />
    </>
  );
};

export default withStyles(styles)(Login);
