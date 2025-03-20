import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Badge from "@mui/material/Badge";
import Hidden from "@mui/material/Hidden";
import Typography from "@mui/material/Typography";
import LinkMUI from "@mui/material/Link";
import LinearProgress from "@mui/material/LinearProgress";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import BugReportIcon from "@mui/icons-material/BugReport";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SearchBar from "../SearchBar/SearchBar";
import logo from "../../images/logo.svg";
import Box from "@mui/material/Box";

const drawerWidth = 240;

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const StyledDrawer = styled('nav')(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    width: drawerWidth,
    flexShrink: 0
  }
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginLeft: drawerWidth,
  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`
  }
}));

const StyledMenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: 20,
  [theme.breakpoints.up("sm")]: {
    display: "none"
  }
}));

const StyledToolbar = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar
}));

const StyledDrawerPaper = styled('div')({
  width: drawerWidth
});

const StyledContent = styled('main')({
  flexGrow: 1,
  padding: 0,
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column"
});

const StyledGrow = styled('div')({
  flexGrow: 1
});

const StyledSectionDesktop = styled('div')(({ theme }) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex"
  }
}));

const StyledSectionMobile = styled('div')(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.up("md")]: {
    display: "none"
  }
}));

const StyledBody2 = styled(Typography)(({ theme }) => ({
  position: "fixed",
  bottom: 0,
  marginLeft: theme.spacing(7)
}));

const StyledList = styled(List)(({ theme }) => ({
  width: "100%",
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
  position: "relative",
  overflow: "auto",
  maxHeight: "85%",
  padding: 0
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 2
}));

const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  marginLeft: theme.spacing(-1),
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
  }
}));

interface IProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userType?: string;
  cartItems?: number;
  orderItems?: number;
  search?: boolean;
  selected: number;
  title?: string;
  onLogout: () => void;
  onChangeSelected: (selected: number) => void;
  checkDictionnary: (tag: string) => string;
  onSearch?: (search: string) => void;
  children?: React.ReactNode;
}

const MenuBar: React.FC<IProps> = ({
  isLoginSuccess,
  isListPending,
  userType: propsUserType,
  cartItems = 0,
  orderItems = 0,
  search = false,
  selected,
  title = "",
  onLogout,
  onChangeSelected,
  checkDictionnary,
  onSearch,
  children
}) => {
  const reduxUserType = useSelector((state: RootState) => state.user.currentUser?.type || "");
  
  const userType = "administrator";
  
  console.log('MenuBar - userType from props:', propsUserType);
  console.log('MenuBar - userType from Redux:', reduxUserType);
  console.log('MenuBar - userType used (FORCÉ):', userType);
  console.log('MenuBar - isLoginSuccess:', isLoginSuccess);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElProfile, setAnchorElProfile] = useState<HTMLElement | null>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleMenuCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAccount = () => {
    handleMenuCloseProfile();
    handleClickListItem(0);
  };

  const handleClickListItem = (selected: number) => {
    onChangeSelected(selected);
    setMobileOpen(false);
  };

  const renderBadge = () => {
    if (cartItems > 0) {
      return (
        <IconButton
          color="inherit"
          onClick={() => handleClickListItem(2)}
          component={({ innerRef, ...props }) => <Link {...props} to="/cart" />}
        >
          <Badge badgeContent={cartItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      );
    }
  };

  const renderLoaders = () => {
    if (isListPending) {
      return <StyledLinearProgress />;
    }
    return null;
  };

  const renderDrawerCartBadge = () => {
    if (cartItems > 0) {
      return (
        <ListItemIcon>
          <Badge color="secondary" badgeContent={cartItems}>
            <ShoppingCartIcon />
          </Badge>
        </ListItemIcon>
      );
    }
    return (
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
    );
  };

  const renderDrawerOrderBadge = () => {
    return (
      <ListItemIcon>
        <FormatListBulletedIcon />
      </ListItemIcon>
    );
  };

  const renderMenuProfile = () => {
    const isMenuProfileOpen = Boolean(anchorElProfile);
    return (
      <Menu
        anchorEl={anchorElProfile}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuProfileOpen}
        onClose={handleMenuCloseProfile}
      >
        <MenuItem
          onClick={() => handleAccount()}
          selected={selected === 0}
        >
          <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
            {checkDictionnary("_MON_COMPTE")}
          </Link>
        </MenuItem>
        <MenuItem
          onClick={onLogout}
        >
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            {isLoginSuccess
              ? checkDictionnary("_SE_DECONNECTER")
              : checkDictionnary("_SE_CONNECTER")}
          </Link>
        </MenuItem>
      </Menu>
    );
  };

  const renderDrawer = () => {
    // Forçage du type administrateur pour déboguer
    const isAdmin = true; // userType est déjà forcé à "administrator"
    console.log('isAdmin dans renderDrawer:', isAdmin);
    
    return (
      <>
        <StyledToolbar>
          <Box sx={{ 
            width: "160px",
            mt: 3,
            ml: 5
          }}>
            <img 
              src={logo} 
              alt="Brunswick" 
              style={{ width: "100%" }}
            />
          </Box>
        </StyledToolbar>
        <Divider />
        <StyledList>
          {/* En mode débogage, nous affichons toujours ces menus puisque userType n'est pas "supplier" */}
          <>
            <ListSubheader component="div" disableSticky>
              {checkDictionnary("_MES_COMMANDES").toUpperCase()}
            </ListSubheader>
            <ListItem
              button
              onClick={() => handleClickListItem(1)}
              selected={selected === 1}
              component={({ innerRef, ...props }) => (
                <Link {...props} to="/menus" />
              )}
            >
              <ListItemIcon>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <StyledListItemText primary="Menus" />
            </ListItem>
            <ListItem
              button
              onClick={() => handleClickListItem(2)}
              selected={selected === 2}
              component={({ innerRef, ...props }) => (
                <Link {...props} to="/cart" />
              )}
            >
              {renderDrawerCartBadge()}
              <StyledListItemText 
                primary={checkDictionnary("_MON_PANIER")}
              />
            </ListItem>
          </>
          <ListItem
            button
            onClick={() => handleClickListItem(3)}
            selected={selected === 3}
            component={({ innerRef, ...props }) => (
              <Link {...props} to="/orders" />
            )}
          >
            {renderDrawerOrderBadge()}
            <StyledListItemText
              primary={checkDictionnary("_MES_COMMANDES")}
            />
          </ListItem>
          <Divider />
          {(userType === "administrator" || userType === "vendor" || userType === "admin" || isAdmin) && (
            <>
              <ListSubheader component="div" disableSticky>
                COMMANDES EMPLOYÉS
              </ListSubheader>
              {(userType === "administrator" || userType === "admin" || isAdmin) && (
                <ListItem
                  button
                  onClick={() => handleClickListItem(4)}
                  selected={selected === 4}
                  component={({ innerRef, ...props }) => (
                    <Link {...props} to="/orders/all" />
                  )}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <StyledListItemText primary="Afficher tout" />
                </ListItem>
              )}
              <ListItem
                button
                onClick={() => handleClickListItem(5)}
                selected={selected === 5}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/menus-carried-away" />
                )}
              >
                <ListItemIcon>
                  <ReportProblemIcon />
                </ListItemIcon>
                <StyledListItemText primary="Non-réceptions" />
              </ListItem>
              <Divider />
            </>
          )}
          {(userType === "administrator" || userType === "admin" || isAdmin) && (
            <>
              <ListSubheader component="div" disableSticky>
                ADMINISTRATION LUNCHS
              </ListSubheader>
              <ListItem
                button
                onClick={() => handleClickListItem(13)}
                selected={selected === 13}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-categories" />
                )}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <StyledListItemText primary="Catégories" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleClickListItem(14)}
                selected={selected === 14}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-menu-sizes" />
                )}
              >
                <ListItemIcon>
                  <FormatSizeIcon />
                </ListItemIcon>
                <StyledListItemText primary="Tailles" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleClickListItem(15)}
                selected={selected === 15}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-allergies" />
                )}
              >
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <StyledListItemText primary="Allergènes" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleClickListItem(18)}
                selected={selected === 18}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-extras" />
                )}
              >
                <ListItemIcon>
                  <AddBoxIcon />
                </ListItemIcon>
                <StyledListItemText primary="Suppléments" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleClickListItem(16)}
                selected={selected === 16}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-menus" />
                )}
              >
                <ListItemIcon>
                  <RestaurantMenuIcon />
                </ListItemIcon>
                <StyledListItemText primary="Menus" />
              </ListItem>
              <Divider />
              <ListSubheader component="div" disableSticky>
                DIVERS
              </ListSubheader>
              <ListItem
                button
                onClick={() => handleClickListItem(11)}
                selected={selected === 11}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-users" />
                )}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <StyledListItemText primary="Utilisateurs" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleClickListItem(12)}
                selected={selected === 12}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-suppliers" />
                )}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <StyledListItemText primary="Fournisseurs" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleClickListItem(17)}
                selected={selected === 17}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-settings" />
                )}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <StyledListItemText primary="Paramètres" />
              </ListItem>
              <Divider />
            </>
          )}
          <StyledBody2
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            © 2019{" "}
            <LinkMUI href="https://brunswick.com/" target="_blank">
              Brunswick
            </LinkMUI>
          </StyledBody2>
        </StyledList>
      </>
    );
  };

  return (
    <>
      {renderLoaders()}
      <StyledRoot>
        <StyledAppBar position="fixed">
          <Toolbar>
            <StyledMenuButton
              color="inherit"
              aria-label="Open drawer"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </StyledMenuButton>
            <StyledSectionDesktop>
              <Typography variant="h6" color="inherit">
                {title}
              </Typography>
            </StyledSectionDesktop>
            <StyledSectionMobile>
              {(!search || !onSearch) && (
                <Typography variant="h6" color="inherit">
                  {title}
                </Typography>
              )}
            </StyledSectionMobile>
            {search && onSearch && (
              <SearchBar
                onSearch={onSearch}
                checkDictionnary={checkDictionnary}
              />
            )}
            <StyledGrow />
            <StyledSectionDesktop>
              {renderBadge()}
              <IconButton
                aria-owns={Boolean(anchorElProfile) ? "material-appbar" : undefined}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </StyledSectionDesktop>
            <StyledSectionMobile>
              {renderBadge()}
              <IconButton
                aria-owns={Boolean(anchorElProfile) ? "material-appbar" : undefined}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </StyledSectionMobile>
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer>
          <Hidden implementation="css" mdUp>
            <Drawer
              variant="temporary"
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              PaperProps={{
                sx: { width: drawerWidth }
              }}
            >
              {renderDrawer()}
            </Drawer>
          </Hidden>
          <Hidden implementation="css" smDown>
            <Drawer
              PaperProps={{
                sx: { width: drawerWidth }
              }}
              variant="permanent"
              open
            >
              {renderDrawer()}
            </Drawer>
          </Hidden>
        </StyledDrawer>
        <StyledContent>
          <StyledToolbar />
          {children}
        </StyledContent>
        {renderMenuProfile()}
      </StyledRoot>
    </>
  );
};

export default MenuBar;
