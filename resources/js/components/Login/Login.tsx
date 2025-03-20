import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import emailValidator from "email-validator";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Snackbar from "../Snackbar/Snackbar";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import { RootState, AppDispatch } from "../../types/redux.d";
import { login } from "../../actions/login";
import { getDictionaries } from "../../actions/dictionnary";

const StyledMain = styled("main")(({ theme }) => ({
  width: "auto",
  display: "block",
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  [theme.breakpoints.up(400)]: {
    width: 400,
    marginLeft: "auto",
    marginRight: "auto"
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: `${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)}`
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.primary.main
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1),
  "& .MuiFormControl-root": {
    width: "100%",
    display: "block",
    marginBottom: theme.spacing(2)
  }
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3)
}));

interface LoginState {
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

interface LoginCredentials {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: token } = useParams();
  const {
    isLoginPending,
    isLoginSuccess,
    loginError,
    listPending,
    editPending,
    isEditSuccess,
    editError,
    userLanguage,
    dictionaryList
  } = useSelector((state: RootState) => ({
    isLoginPending: state.login.isLoginPending,
    isLoginSuccess: state.login.isLoginSuccess,
    loginError: state.login.loginError,
    listPending: state.list.isPending,
    editPending: state.edit.isPending,
    isEditSuccess: state.edit.isSuccess,
    editError: state.edit.error,
    userLanguage: state.user.currentUser?.language || "",
    dictionaryList: state.dictionary.list
  }));

  const [state, setState] = React.useState<LoginState>({
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
      handleEditToken(token);
    }
    dispatch(getDictionaries());
  }, [token, dispatch]);

  const handleEditToken = async (token: string) => {
    dispatch({ type: "EDIT_TOKEN", payload: token });
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
      const credentials: LoginCredentials = {
        email: emailAddress,
        password: password
      };
      dispatch(login(credentials));
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
      dispatch({ type: "REGISTER", payload: { password, confirmPassword } });
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
      dispatch({ type: "RESET_PASSWORD", payload: emailAddress });
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

  const getDictionaryValue = (tag: string) => {
    return checkDictionnary(tag, dictionaryList, userLanguage);
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
      <StyledMain className="login-container">
        <StyledPaper className="login-paper">
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography component="h1" variant="h5">
            {getDictionaryValue("login")}
          </Typography>
          <StyledForm noValidate className="centered-form">
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">
                {getDictionaryValue("email")}
              </InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={emailAddress}
                onChange={handleChangeEmailAddress}
                onKeyPress={handleKeyPressLogin}
                className="centered-input"
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">
                {getDictionaryValue("password")}
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleChangePassword}
                onKeyPress={handleKeyPressLogin}
                className="centered-input"
              />
            </FormControl>
            <FormControlLabel
              className="reset-password-control"
              control={
                <Checkbox
                  value="resetPassword"
                  color="primary"
                  checked={resetPassword}
                  onChange={handleChangeResetPassword}
                />
              }
              label={getDictionaryValue("want_reset_password") || "Je souhaite réinitialiser mon mot de passe"}
            />
            {!validated && (
              <FormHelperText error>
                {getDictionaryValue("invalid_email_password")}
              </FormHelperText>
            )}
            {!resetPassword ? (
              <StyledSubmitButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
                disabled={isLoginPending}
                size="large"
              >
                {isLoginPending ? (
                  <LinearProgress />
                ) : (
                  getDictionaryValue("login")
                )}
              </StyledSubmitButton>
            ) : (
              <StyledSubmitButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleResetPassword}
                disabled={isLoginPending}
                size="large"
              >
                {isLoginPending ? (
                  <LinearProgress />
                ) : (
                  getDictionaryValue("reset_password") || "Réinitialiser"
                )}
              </StyledSubmitButton>
            )}
          </StyledForm>
        </StyledPaper>
      </StyledMain>
      <Snackbar
        open={openLogin}
        onClose={handleCloseLogin}
        message={loginError ?? ""}
      />
      <Snackbar
        open={openEdit}
        onClose={handleCloseEdit}
        message={editError ?? ""}
      />
      <Snackbar
        open={openReset}
        onClose={handleCloseReset}
        message={getDictionaryValue("reset_password_sent")}
      />
    </>
  );
};

export default Login;
