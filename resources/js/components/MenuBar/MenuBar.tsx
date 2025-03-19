import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import Badge from "@material-ui/core/Badge";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import LinkMUI from "@material-ui/core/Link";
import LinearProgress from "@material-ui/core/LinearProgress";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import PeopleIcon from "@material-ui/icons/People";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import FolderIcon from "@material-ui/icons/Folder";
import SettingsIcon from "@material-ui/icons/Settings";
import BugReportIcon from "@material-ui/icons/BugReport";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import FormatSizeIcon from "@material-ui/icons/FormatSize";
import AddBoxIcon from "@material-ui/icons/AddBox";
import SearchBar from "../SearchBar/SearchBar";
import logo from "../../images/logo.svg";

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    appBar: {
      marginLeft: drawerWidth,
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`
      }
    },
    menuButton: {
      marginRight: 20,
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    toolbar: {
      ...theme.mixins.toolbar
    },
    drawerPaper: {
      width: drawerWidth
    },
    content: {
      flexGrow: 1,
      padding: 0,
      display: "flex",
      minHeight: "100vh",
      flexDirection: "column"
    },
    grow: {
      flexGrow: 1
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    },
    body2: {
      position: "fixed",
      bottom: 0,
      marginLeft: theme.spacing(7)
    },
    img: {
      width: "160px",
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(5)
    },
    list: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto",
      maxHeight: "85%",
      padding: 0
    },
    linearProgress: {
      zIndex: theme.zIndex.drawer + 2
    }
  });

interface IProvidedProps {
  classes: any;
  theme: Theme;
}

interface IProps {
  isLoginSuccess: boolean;
  isListPending: boolean;
  userType: string;
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

interface IState {
  mobileOpen: boolean;
  anchorElProfile: HTMLElement | null;
}

class MenuBar extends Component<IProvidedProps & IProps, IState> {
  static defaultProps = {
    cartItems: 0,
    orderItems: 0,
    search: false,
    title: ""
  };

  state = {
    mobileOpen: false,
    anchorElProfile: null
  };

  handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorElProfile: event.currentTarget });
  };

  handleMenuCloseProfile = () => {
    this.setState({ anchorElProfile: null });
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleAccount = () => {
    this.handleMenuCloseProfile();
    this.handleClickListItem(0);
  };

  handleClickListItem = (selected: number) => {
    this.props.onChangeSelected(selected);
    this.setState({
      mobileOpen: false
    });
  };

  renderBadge = () => {
    const { cartItems } = this.props;
    if (cartItems && cartItems > 0) {
      return (
        <IconButton
          color="inherit"
          onClick={() => this.handleClickListItem(2)}
          component={({ innerRef, ...props }) => <Link {...props} to="/cart" />}
        >
          <Badge badgeContent={cartItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      );
    }
  };

  renderLoaders = () => {
    const { isListPending } = this.props;
    if (isListPending) {
      return <LinearProgress className={this.props.classes.linearProgress} />;
    }
    return null;
  };

  renderDrawerCartBadge = () => {
    const { cartItems } = this.props;
    if (cartItems && cartItems > 0) {
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

  renderDrawerOrderBadge = () => {
    const { orderItems } = this.props;
    /*
    if (orderItems && orderItems > 0) {
      return (
        <ListItemIcon>
          <Badge color="primary" badgeContent={orderItems}>
            <FormatListBulletedIcon />
          </Badge>
        </ListItemIcon>
      );
    }*/
    return (
      <ListItemIcon>
        <FormatListBulletedIcon />
      </ListItemIcon>
    );
  };

  renderMenuProfile = () => {
    const { selected, isLoginSuccess } = this.props;
    const { anchorElProfile } = this.state;
    const isMenuProfileOpen = Boolean(anchorElProfile);
    return (
      <Menu
        anchorEl={anchorElProfile}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuProfileOpen}
        onClose={this.handleMenuCloseProfile}
      >
        <MenuItem
          button
          onClick={() => this.handleAccount()}
          selected={selected === 0}
        >
          <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
            {this.props.checkDictionnary("_MON_COMPTE")}
          </Link>
        </MenuItem>
        <MenuItem
          button
          onClick={this.props.onLogout}
        >
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
            {isLoginSuccess
              ? this.props.checkDictionnary("_SE_DECONNECTER")
              : this.props.checkDictionnary("_SE_CONNECTER")}
          </Link>
        </MenuItem>
      </Menu>
    );
  };

  renderDrawer = () => {
    const { userType, selected, classes } = this.props;
    return (
      <>
        <div className={classes.toolbar}>
          <img src={logo} alt="Brunswick" className={classes.img} />
        </div>
        <Divider />
        <List className={classes.list}>
          {userType !== "supplier" && (
            <>
              <ListSubheader component="div" disableSticky>
                {this.props.checkDictionnary("_MES_COMMANDES").toUpperCase()}
              </ListSubheader>
              <ListItem
                button
                onClick={() => this.handleClickListItem(1)}
                selected={selected === 1}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/menus" />
                )}
              >
                <ListItemIcon>
                  <RestaurantMenuIcon />
                </ListItemIcon>
                <ListItemText inset primary="Menus" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(2)}
                selected={selected === 2}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/cart" />
                )}
              >
                {this.renderDrawerCartBadge()}
                <ListItemText
                  inset
                  primary={this.props.checkDictionnary("_MON_PANIER")}
                />
              </ListItem>
            </>
          )}
          <ListItem
            button
            onClick={() => this.handleClickListItem(3)}
            selected={selected === 3}
            component={({ innerRef, ...props }) => (
              <Link {...props} to="/orders" />
            )}
          >
            {this.renderDrawerOrderBadge()}
            <ListItemText
              inset
              primary={this.props.checkDictionnary("_MES_COMMANDES")}
            />
          </ListItem>
          <Divider />
          {(userType === "administrator" || userType === "vendor") && (
            <>
              <ListSubheader component="div" disableSticky>
                COMMANDES EMPLOYÉS
              </ListSubheader>
              {userType === "administrator" && (
                <ListItem
                  button
                  onClick={() => this.handleClickListItem(4)}
                  selected={selected === 4}
                  component={({ innerRef, ...props }) => (
                    <Link {...props} to="/orders/all" />
                  )}
                >
                  <ListItemIcon>
                    <FormatListBulletedIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="Afficher tout" />
                </ListItem>
              )}
              <ListItem
                button
                onClick={() => this.handleClickListItem(5)}
                selected={selected === 5}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/menus-carried-away" />
                )}
              >
                <ListItemIcon>
                  <ReportProblemIcon />
                </ListItemIcon>
                <ListItemText inset primary="Non-réceptions" />
              </ListItem>
              <Divider />
            </>
          )}
          {userType === "administrator" && (
            <>
              <ListSubheader component="div" disableSticky>
                ADMINISTRATION LUNCHS
              </ListSubheader>
              <ListItem
                button
                onClick={() => this.handleClickListItem(13)}
                selected={selected === 13}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-categories" />
                )}
              >
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText inset primary="Catégories" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(14)}
                selected={selected === 14}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-menu-sizes" />
                )}
              >
                <ListItemIcon>
                  <FormatSizeIcon />
                </ListItemIcon>
                <ListItemText inset primary="Tailles" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(15)}
                selected={selected === 15}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-allergies" />
                )}
              >
                <ListItemIcon>
                  <BugReportIcon />
                </ListItemIcon>
                <ListItemText inset primary="Allergènes" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(18)}
                selected={selected === 18}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-extras" />
                )}
              >
                <ListItemIcon>
                  <AddBoxIcon />
                </ListItemIcon>
                <ListItemText inset primary="Suppléments" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(16)}
                selected={selected === 16}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-menus" />
                )}
              >
                <ListItemIcon>
                  <RestaurantMenuIcon />
                </ListItemIcon>
                <ListItemText inset primary="Menus" />
              </ListItem>
              <Divider />
              <ListSubheader component="div" disableSticky>
                DIVERS
              </ListSubheader>
              <ListItem
                button
                onClick={() => this.handleClickListItem(11)}
                selected={selected === 11}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-users" />
                )}
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText inset primary="Utilisateurs" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(12)}
                selected={selected === 12}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-suppliers" />
                )}
              >
                <ListItemIcon>
                  <LocalShippingIcon />
                </ListItemIcon>
                <ListItemText inset primary="Fournisseurs" />
              </ListItem>
              <ListItem
                button
                onClick={() => this.handleClickListItem(17)}
                selected={selected === 17}
                component={({ innerRef, ...props }) => (
                  <Link {...props} to="/manage-settings" />
                )}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText inset primary="Paramètres" />
              </ListItem>
              <Divider />
            </>
          )}
          <Typography
            className={classes.body2}
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            © 2019{" "}
            <LinkMUI href="https://brunswick.com/" target="_blank">
              Brunswick
            </LinkMUI>
          </Typography>
        </List>
      </>
    );
  };

  render() {
    const { search, title, classes, theme } = this.props;
    const { mobileOpen, anchorElProfile } = this.state;
    const isMenuProfileOpen = Boolean(anchorElProfile);
    return (
      <>
        {this.renderLoaders()}
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <div className={classes.sectionDesktop}>
                <Typography variant="h6" color="inherit">
                  {title}
                </Typography>
              </div>
              <div className={classes.sectionMobile}>
                {(!search || !this.props.onSearch) && (
                  <Typography variant="h6" color="inherit">
                    {title}
                  </Typography>
                )}
              </div>
              {search && this.props.onSearch && (
                <SearchBar
                  onSearch={this.props.onSearch}
                  checkDictionnary={this.props.checkDictionnary}
                />
              )}
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                {this.renderBadge()}
                <IconButton
                  aria-owns={isMenuProfileOpen ? "material-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
              </div>
              <div className={classes.sectionMobile}>
                {this.renderBadge()}
                <IconButton
                  aria-owns={isMenuProfileOpen ? "material-appbar" : undefined}
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircleIcon />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer}>
            <Hidden implementation="css" mdUp>
              <Drawer
                variant="temporary"
                anchor={theme.direction === "rtl" ? "right" : "left"}
                open={mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper
                }}
              >
                {this.renderDrawer()}
              </Drawer>
            </Hidden>
            <Hidden implementation="css" smDown>
              <Drawer
                classes={{
                  paper: classes.drawerPaper
                }}
                variant="permanent"
                open
              >
                {this.renderDrawer()}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {this.props.children}
          </main>
          {this.renderMenuProfile()}
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MenuBar);
