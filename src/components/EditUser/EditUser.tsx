import React, { Component } from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import emailValidator from "email-validator";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import userTypes from "../../utils/UserTypes/UserTypes";
import ISupplier from "../../interfaces/ISupplier";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  type: string;
  supplierId: number;
  language: string;
  supplierList: ISupplier[];
  onClose: () => void;
  onEdit: (
    firstName: string,
    lastName: string,
    emailAddress: string,
    type: string,
    supplierId: number,
    language: string,
    resetPassword: boolean
  ) => void;
}

interface IState {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  type: string;
  supplierId: number;
  language: string;
  resetPassword: boolean;
  validated: boolean;
}

class EditUser extends Component<IProvidedProps & IProps, IState> {
  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    emailAddress: this.props.emailAddress,
    password: "",
    type: this.props.type,
    supplierId: this.props.supplierId,
    language: this.props.language,
    resetPassword: false,
    validated: true
  };

  handleChangeFirstName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      firstName: value
    });
  };

  handleChangeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      lastName: value
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

  handleChangeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState(state => {
      return {
        type: value,
        supplierId: value === "supplier" ? 1 : state.supplierId
      };
    });
  };

  handleChangeSupplierId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      supplierId: parseInt(value)
    });
  };

  handleChangeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      language: value
    });
  };

  handleChangeResetPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    this.setState({
      resetPassword: checked
    });
  };

  handleValidated = () => {
    const {
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language,
      resetPassword
    } = this.state;
    if (
      !firstName ||
      !lastName ||
      !emailValidator.validate(emailAddress) ||
      !type ||
      (type === "supplier" && !supplierId) ||
      !language
    ) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onEdit(
        firstName,
        lastName,
        emailAddress,
        type,
        supplierId,
        language,
        resetPassword
      );
    }
  };

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      type,
      supplierId,
      language,
      resetPassword,
      validated
    } = this.state;
    const { supplierList, classes } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Éditer un utilisateur</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={lastName}
                onChange={this.handleChangeLastName}
                autoFocus
                id="lastName"
                label="Nom"
                type="text"
                fullWidth
                required
                error={!validated && !lastName}
              />
            </Grid>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={firstName}
                onChange={this.handleChangeFirstName}
                id="firstName"
                label="Prénom"
                type="text"
                fullWidth
                required
                error={!validated && !firstName}
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={emailAddress}
                onChange={this.handleChangeEmailAddress}
                id="emailAddress"
                label="Adresse e-mail"
                type="email"
                fullWidth
                required
                error={!validated && !emailValidator.validate(emailAddress)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs>
              <FormControl
                className={classes.margin}
                fullWidth
                required
                error={!validated && !type}
              >
                <InputLabel htmlFor="type">Rôle</InputLabel>
                <Select
                  value={type}
                  onChange={this.handleChangeType}
                  inputProps={{
                    name: "type",
                    id: "type"
                  }}
                >
                  {userTypes.map(userType => (
                    <MenuItem key={userType.value} value={userType.value}>
                      {userType.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {type === "supplier" && (
              <Grid item xs>
                <FormControl
                  className={classes.margin}
                  fullWidth
                  required
                  error={!validated && (type === "supplier" && !supplierId)}
                >
                  <InputLabel htmlFor="category">Fournisseur</InputLabel>
                  <Select
                    value={supplierId}
                    onChange={this.handleChangeSupplierId}
                    inputProps={{
                      name: "category",
                      id: "category"
                    }}
                  >
                    {supplierList.map(supplier => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <FormControl
            className={classes.margin}
            fullWidth
            required
            error={!validated && !language}
          >
            <InputLabel htmlFor="category">Langue</InputLabel>
            <Select
              value={language}
              onChange={this.handleChangeLanguage}
              inputProps={{
                name: "language",
                id: "language"
              }}
            >
              <MenuItem key="en" value="en">
                🇺🇸 English
              </MenuItem>
              <MenuItem key="fr" value="fr">
                🇫🇷 Français
              </MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={resetPassword}
                onChange={this.handleChangeResetPassword}
                value="checkedA"
                color="primary"
              />
            }
            label="Réinitialiser le mot de passe"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={this.handleValidated} color="primary">
            Éditer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditUser);
