import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Typography, List, ListItem, ListItemText, Select, MenuItem, Grid, Divider, SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import userTypes from "../../utils/UserTypes/UserTypes";
import { getDictionaries } from "../../actions/dictionnary";
import { logout } from "../../actions/login";
import { updateUser } from "../../actions/user";
import { setSelected } from "../../actions/page";
import { AppDispatch, RootState } from "../../types/redux.d";
import IUser from "../../interfaces/IUser";

const HeroUnit = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4)
}));

const Layout = styled('div')(({ theme }) => ({
  width: "auto",
  margin: "0 auto",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4)
  }
}));

const ListContainer = styled(List)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    minWidth: "450px"
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1)
}));

const Account: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [localUserLanguage, setLocalUserLanguage] = useState<string>('fr');

  const {
    currentUser,
    isLoading: isUserLoading,
    error: userError
  } = useSelector((state: RootState) => state.user);

  const {
    isLoginSuccess
  } = useSelector((state: RootState) => state.login);

  const {
    selected
  } = useSelector((state: RootState) => state.page);

  const {
    list: dictionnaryList,
    isLoading: isListPending
  } = useSelector((state: RootState) => state.dictionary);

  useEffect(() => {
    if (currentUser?.language) {
      setLocalUserLanguage(currentUser.language);
    }
    refresh();
  }, [currentUser]);

  const refresh = () => {
    dispatch(getDictionaries());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChangeUserLanguage = (event: SelectChangeEvent<unknown>) => {
    const { value } = event.target;
    if (currentUser && typeof value === 'string') {
      dispatch(updateUser({ ...currentUser, language: value }))
        .unwrap()
        .then(() => {
          setLocalUserLanguage(value);
        })
        .catch((error) => {
          console.error('Failed to update user language:', error);
        });
    }
  };

  const handleChangeSelected = (selected: number) => {
    dispatch(setSelected(selected));
    localStorage.setItem("selected", selected.toString());
  };

  const checkDictionnaryValue = (define: string) => {
    return checkDictionnary(define, dictionnaryList, localUserLanguage);
  };

  if (!isLoginSuccess || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={currentUser.type}
      selected={selected}
      title={checkDictionnaryValue("_MON_COMPTE")}
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={checkDictionnaryValue}
    >
      <main style={{ flex: 1 }}>
        <Layout>
          <HeroUnit>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  align="center"
                  color="text.secondary"
                  gutterBottom
                >
                  {checkDictionnaryValue("_DONNEES_PERSONNELLES")}
                </Typography>
                <ListContainer>
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnaryValue("_NOM")}
                      secondary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          align="center"
                        >
                          {currentUser.last_name.toUpperCase()}
                        </Typography>
                      }
                      primaryTypographyProps={{ align: 'center' }}
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnaryValue("_PRENOM")}
                      secondary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          align="center"
                        >
                          {currentUser.first_name}
                        </Typography>
                      }
                      primaryTypographyProps={{ align: 'center' }}
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnaryValue("_ADRESSE_EMAIL")}
                      secondary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          align="center"
                        >
                          {currentUser.email_address}
                        </Typography>
                      }
                      primaryTypographyProps={{ align: 'center' }}
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnaryValue("_TYPE_DE_COMPTE")}
                      secondary={
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          align="center"
                        >
                          {userTypes.find(x => x.value === currentUser.type)?.label}
                        </Typography>
                      }
                      primaryTypographyProps={{ align: 'center' }}
                    />
                  </ListItem>
                  <Divider light />
                  <ListItem>
                    <ListItemText
                      primary={checkDictionnaryValue("_LANGUE")}
                      secondary={
                        <StyledSelect
                          value={localUserLanguage}
                          onChange={handleChangeUserLanguage}
                          disabled={isUserLoading}
                        >
                          <MenuItem value="en">🇺🇸 English</MenuItem>
                          <MenuItem value="fr">🇫🇷 Français</MenuItem>
                        </StyledSelect>
                      }
                      primaryTypographyProps={{ align: 'center' }}
                    />
                  </ListItem>
                </ListContainer>
              </Grid>
            </Grid>
          </HeroUnit>
        </Layout>
      </main>
      <Footer />
    </MenuBar>
  );
};

export default Account;
