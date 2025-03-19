import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useDispatch } from "react-redux";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import userTypes from "../../utils/UserTypes/UserTypes";
import { getDictionaries } from "../../actions/dictionnary";
import { logout } from "../../actions/login";
import { setUserLanguage } from "../../actions/user";
import { setSelected } from "../../actions/page";
import { AppDispatch } from "../../types/redux";

const HeroUnit = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: ".625rem"
}));

const Layout = styled('div')(({ theme }) => ({
  width: "auto",
  margin: "0 auto",
  padding: 0,
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4)
  }
}));

const ListContainer = styled(List)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    minWidth: "450px"
  }
}));

interface IProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userId: number;
  userFirstName: string;
  userLastName: string;
  userEmailAddress: string;
  userType: string;
  userToken: string;
  userLanguage: string;
  selected: number;
  dictionnaryList: any[];
}

const Account: React.FC<IProps> = ({
  isLoginSuccess,
  isListPending,
  userFirstName,
  userLastName,
  userEmailAddress,
  userType,
  userLanguage,
  selected,
  dictionnaryList
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [localUserLanguage, setLocalUserLanguage] = useState(userLanguage);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    dispatch(getDictionaries());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChangeUserLanguage = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    dispatch(setUserLanguage(value));
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      userObj.language = value;
      localStorage.setItem("user", JSON.stringify(userObj));
    }
    setLocalUserLanguage(value);
  };

  const handleChangeSelected = (selected: number) => {
    dispatch(setSelected(selected));
    localStorage.setItem("selected", selected.toString());
  };

  const checkDictionnaryValue = (define: string) => {
    return checkDictionnary(define, dictionnaryList, userLanguage);
  };

  if (!isLoginSuccess) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
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
                  color="textSecondary"
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
                      primary={checkDictionnaryValue("_PRENOM")}
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
                      primary={checkDictionnaryValue("_ADRESSE_EMAIL")}
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
                      primary={checkDictionnaryValue("_TYPE_DE_COMPTE")}
                      secondary={
                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          className="centered-text"
                        >
                          {userTypes.filter(x => x.value === userType)[0].label}
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
                      primary={checkDictionnaryValue("_LANGUE")}
                      secondary={
                        <Select
                          value={localUserLanguage}
                          onChange={handleChangeUserLanguage}
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
