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
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import BugReportIcon from "@material-ui/icons/BugReport";
import placeHolderIcon from "../../images/placeholder.svg";
import ICart from "../../interfaces/ICart";
import S3_BASE_URL from "../../utils/S3Utils/S3Utils";

const styles = (theme: Theme) => ({
  dialogPaperScrollBody: {
    margin: `${theme.spacing.unit * 3}px !important`,
    [theme.breakpoints.up("md")]: {
      margin: `${theme.spacing.unit * 6}px auto !important`
    }
  },
  textField: {
    marginTop: 0
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
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  cart: ICart;
  userLanguage: string;
  onEditShoppingCart: (cart: ICart, quantity: number, remark: string) => void;
  onDeleteShoppingCart: (cart: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

interface IState {
  quantity: number;
  remark: string;
}

class EditCart extends Component<IProvidedProps & IProps, IState> {
  state = {
    quantity: this.props.cart.quantity,
    remark: this.props.cart.remark
  };

  handleAddQuantity = () => {
    this.setState(state => {
      return {
        quantity: state.quantity + 1
      };
    });
  };

  handleRemoveQuantity = () => {
    this.setState(state => {
      return {
        quantity: state.quantity > 0 ? state.quantity - 1 : state.quantity
      };
    });
  };

  handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      remark: value
    });
  };

  calculateTotalExtras = () => {
    const { cart } = this.props;
    let totalPricingArray = [];
    let totalPricing = 0;
    if (cart.extras && cart.extras.length > 0) {
      totalPricingArray = cart.extras.map(extra => {
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
    const { quantity, remark } = this.state;
    const { cart, userLanguage, classes } = this.props;
    const totalPricing =
      quantity * parseFloat(cart.menu.pricing) +
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
              cart.menu.picture
                ? `${S3_BASE_URL}/${cart.menu.picture}`
                : placeHolderIcon
            }
            className={classes.img}
          />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" className={classes.fontWeight}>
            {userLanguage === "en" ? cart.menu.title_en : cart.menu.title}
          </Typography>
          {cart.menu.MenuSize && (
            <Typography
              color="textSecondary"
              variant="body1"
              className={classes.margin}
            >
              {userLanguage === "en"
                ? cart.menu.MenuSize.title_en
                : cart.menu.MenuSize.title}
            </Typography>
          )}
          {cart.menu.description && (
            <Typography
              color="textSecondary"
              variant="body1"
              className={classes.margin}
            >
              {userLanguage === "en"
                ? cart.menu.description_en
                : cart.menu.description}
            </Typography>
          )}
          {cart.menu.Allergy && cart.menu.Allergy.length > 0 && (
            <Typography
              color="secondary"
              variant="body1"
              className={classNames(classes.body1, classes.margin)}
            >
              <BugReportIcon className={classes.leftIcon} />
              {cart.menu.Allergy.map(allergy =>
                userLanguage === "en"
                  ? allergy.description_en
                  : allergy.description
              ).join(", ")}
            </Typography>
          )}
          {cart.extras && cart.extras.length > 0 && (
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
                {cart.extras.map(extra => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        value={extra.id}
                        checked
                        disabled
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
          <TextField
            id="standard-multiline-flexible"
            label={this.props.checkDictionnary("_REMARQUES")}
            value={remark}
            onChange={this.handleChangeRemark}
            fullWidth
            className={classes.textField}
          />
        </DialogContent>
        <DialogActions>
          {quantity > 0 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() =>
                this.props.onEditShoppingCart(cart, quantity, remark)
              }
            >
              {this.props.checkDictionnary("_METTRE_A_JOUR")}
            </Button>
          )}
          {quantity === 0 && (
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => this.props.onDeleteShoppingCart(cart)}
            >
              {this.props.checkDictionnary("_SUPPRIMER_LE_MENU")}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditCart);
