import React, { Component } from "react";
import classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import BugReportIcon from "@material-ui/icons/BugReport";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import extraSort from "../../utils/ExtraSort/ExtraSort";
import allergySort from "../../utils/AllergySort/AllergySort";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) => ({
  dialogContent: {
    paddingBottom: 0
  },
  dialogActions: {
    boxShadow: "0px -3px 6px -2px rgba(0,0,0,0.07)",
    padding: theme.spacing.unit * 2,
    display: "block",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  dialogPaperScrollBody: {
    margin: `${theme.spacing.unit * 3}px !important`,
    [theme.breakpoints.up("md")]: {
      margin: `${theme.spacing.unit * 6}px auto !important`,
      maxWidth: "400px !important"
    }
  },
  img: {
    width: "192px",
    [theme.breakpoints.up("md")]: {
      width: "256px"
    },
    borderRadius: "3px"
  },
  fontWeight: {
    fontWeight: 600
  },
  margin: {
    marginTop: theme.spacing.unit
  },
  marginDouble: {
    marginTop: theme.spacing.unit * 2
  },
  formControl: {
    width: "100%"
  },
  formControlLabelRoot: {
    width: "100%"
  },
  formControlLabelLabel: {
    width: "100%"
  },
  radioGroup: {
    width: "100%"
  },
  radio: {
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 2
  },
  body1: {
    display: "flex",
    alignItems: "center"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up("md")]: {
      marginBottom: 0
    }
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  menu: IMenu;
  menus: IMenu[];
  userLanguage: string;
  onAdd: (item: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

interface IState {
  currentMenu: IMenu;
  currentMenuId: number;
  quantity: number;
  extras: IExtra[];
}

class AddCart extends Component<IProvidedProps & IProps, IState> {
  state = {
    currentMenu: this.props.menu,
    currentMenuId: this.props.menu.id,
    quantity: 1,
    extras: [] as IExtra[]
  };

  handleRemoveQuantity = () => {
    this.setState(state => {
      return {
        quantity: state.quantity > 1 ? state.quantity - 1 : state.quantity
      };
    });
  };

  handleAddQuantity = () => {
    this.setState(state => {
      return {
        quantity: state.quantity + 1
      };
    });
  };

  handleChangeSize = (event: React.ChangeEvent<{}>, value: string) => {
    const { menus } = this.props;
    this.setState({
      currentMenu: menus.filter(x => x.id === parseInt(value))[0],
      currentMenuId: parseInt(value),
      extras: []
    });
  };

  handleChangeExtra = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const { value } = event.target;
    const { extras, currentMenu } = this.state;
    let extrasTmp = extras as IExtra[];
    if (checked) {
      extrasTmp.push(
        currentMenu.Extra.filter(x => x.id === parseInt(value))[0]
      );
    } else {
      extrasTmp = extrasTmp.filter(x => x.id !== parseInt(value));
    }
    this.setState({
      extras: extrasTmp
    });
  };

  calculateTotalExtras = () => {
    const { extras } = this.state;
    let totalPricingArray = [];
    let totalPricing = 0;
    if (extras && extras.length > 0) {
      totalPricingArray = extras.map(extra => {
        return parseFloat(extra.pricing);
      });
      totalPricing = totalPricingArray.reduce(
        (a: number, b: number) => a + b,
        0
      );
    }
    return totalPricing;
  };

  render() {
    const { currentMenu, currentMenuId, quantity, extras } = this.state;
    const { menus, userLanguage, classes } = this.props;
    const totalPricing =
      quantity * parseFloat(currentMenu.pricing) +
      quantity * this.calculateTotalExtras();
    return (
      <Dialog
        open
        scroll="body"
        maxWidth="xs"
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
        classes={{
          paperScrollBody: classes.dialogPaperScrollBody
        }}
      >
        <DialogTitle id="form-dialog-title" className="centered-text">
          <img
            src={
              currentMenu.picture
                ? `${S3_BASE_URL}/${currentMenu.picture}`
                : placeHolderIcon
            }
            className={classes.img}
          />
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography variant="h5" className={classes.fontWeight}>
            {userLanguage === "en" ? currentMenu.title_en : currentMenu.title}
          </Typography>
          {currentMenu.MenuSize && (!menus || menus.length === 1) && (
            <Typography
              color="textSecondary"
              variant="body1"
              className={classes.margin}
            >
              {userLanguage === "en"
                ? currentMenu.MenuSize.title_en
                : currentMenu.MenuSize.title}
            </Typography>
          )}
          {currentMenu.description && (
            <Typography
              color="textSecondary"
              variant="body1"
              className={classes.margin}
            >
              {userLanguage === "en"
                ? currentMenu.description_en
                : currentMenu.description}
            </Typography>
          )}
          {currentMenu.Allergy && currentMenu.Allergy.length > 0 && (
            <Typography
              color="secondary"
              variant="body1"
              className={classNames(classes.body1, classes.margin)}
            >
              <BugReportIcon className={classes.leftIcon} />
              {currentMenu.Allergy.sort(allergySort)
                .map(allergy =>
                  userLanguage === "en"
                    ? allergy.description_en
                    : allergy.description
                )
                .join(", ")}
            </Typography>
          )}
          {menus && menus.length > 1 && (
            <FormControl
              className={classNames(classes.formControl, classes.marginDouble)}
            >
              <FormLabel>
                <Typography
                  variant="h6"
                  className={classes.fontWeight}
                  gutterBottom
                >
                  {this.props.checkDictionnary("_TAILLE")}
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-label="Size"
                name="size"
                value={currentMenuId.toString()}
                onChange={this.handleChangeSize}
                className={classes.radioGroup}
              >
                {menus.map(menu => (
                  <FormControlLabel
                    key={menu.id}
                    value={menu.id.toString()}
                    control={
                      <Radio color="primary" className={classes.radio} />
                    }
                    label={
                      userLanguage === "en"
                        ? menu.MenuSize.title_en
                        : menu.MenuSize.title
                    }
                    className={classes.formControlLabel}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}
          {currentMenu.Extra && currentMenu.Extra.length > 0 && (
            <FormControl
              className={classNames(classes.formControl, classes.marginDouble)}
            >
              <FormLabel>
                <Typography
                  variant="h6"
                  className={classes.fontWeight}
                  gutterBottom
                >
                  {this.props.checkDictionnary("_SUPPLEMENTS")}
                </Typography>
              </FormLabel>
              <FormGroup className={classes.radioGroup}>
                {currentMenu.Extra.sort(extraSort).map(extra => (
                  <FormControlLabel
                    key={extra.id}
                    control={
                      <Checkbox
                        color="primary"
                        value={extra.id.toString()}
                        checked={
                          extras.filter(x => x.id === extra.id).length > 0
                        }
                        onChange={this.handleChangeExtra}
                        className={classes.radio}
                      />
                    }
                    label={
                      <Grid container spacing={8}>
                        <Grid item xs={8}>
                          <Typography variant="body1" noWrap>
                            {userLanguage === "en"
                              ? extra.title_en
                              : extra.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            {`(+ ${parseFloat(extra.pricing).toLocaleString(
                              "fr",
                              {
                                minimumFractionDigits: 2
                              }
                            )} €)`}
                          </Typography>
                        </Grid>
                      </Grid>
                    }
                    classes={{
                      root: classes.formControlLabelRoot,
                      label: classes.formControlLabelLabel
                    }}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}
          <Grid container alignItems="center" className={classes.margin}>
            <Grid item xs className="right-text">
              <IconButton color="primary" onClick={this.handleRemoveQuantity}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid item xs className="centered-text">
              <Typography variant="h5" className={classes.fontWeight}>
                {quantity}
              </Typography>
            </Grid>
            <Grid item xs className="left-text">
              <IconButton color="primary" onClick={this.handleAddQuantity}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
          </Grid>
          <div className="centered-text">
            <Typography color="textSecondary" variant="body1">
              {this.props.checkDictionnary("_PRIX")} :{" "}
              {totalPricing.toLocaleString("fr", {
                minimumFractionDigits: 2
              })}{" "}
              €
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              this.props.onAdd({
                menu: currentMenu,
                quantity,
                remark: "",
                extras
              })
            }
            fullWidth
            className={classes.button}
          >
            {this.props.checkDictionnary("_AJOUTER_AU_PANIER")}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={this.props.onClose}
            fullWidth
          >
            {this.props.checkDictionnary("_ANNULER")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddCart);
