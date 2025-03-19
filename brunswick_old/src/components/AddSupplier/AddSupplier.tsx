import React, { Component } from "react";
import emailValidator from "email-validator";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  onClose: () => void;
  onAdd: (name: string, emailAddress: string, emailAddress2: string, emailAddress3: string, forVendorOnly: boolean) => void;
}

interface IState {
  name: string;
  emailAddress: string;
  emailAddress2: string;
  emailAddress3: string;
  forVendorOnly: boolean;
  validated: boolean;
}

class AddSupplier extends Component<IProvidedProps & IProps, IState> {
  state = {
    name: "",
    emailAddress: "",
    emailAddress2: "",
    emailAddress3: "",
    forVendorOnly: false,
    validated: true
  };

  handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      name: value
    });
  };

  handleChangeEmailAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      emailAddress: value
    });
  };

  handleChangeEmailAddress2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      emailAddress2: value
    });
  };

  handleChangeEmailAddress3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      emailAddress3: value
    });
  };

  handleChangeForVendorOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    this.setState({
      forVendorOnly: checked
    });
  };

  handleValidated = () => {
    const { name, emailAddress, emailAddress2, emailAddress3, forVendorOnly } = this.state;
    if (!name || !emailValidator.validate(emailAddress)) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onAdd(name, emailAddress, emailAddress2, emailAddress3, forVendorOnly);
    }
  };

  render() {
    const { name, emailAddress, emailAddress2, emailAddress3, forVendorOnly, validated } = this.state;
    const { classes } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Ajouter un fournisseur</DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={name}
                onChange={this.handleChangeName}
                autoFocus
                id="name"
                label="Nom"
                type="text"
                fullWidth
                required
                error={!validated && !name}
              />
            </Grid>
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
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={emailAddress2}
                onChange={this.handleChangeEmailAddress2}
                id="emailAddress2"
                label="Adresse e-mail"
                type="email"
                fullWidth        
                error={emailAddress2 != null && (!validated && !emailValidator.validate(emailAddress2))}
              />
            </Grid>
            <Grid item xs>
              <TextField
                className={classes.margin}
                value={emailAddress3}
                onChange={this.handleChangeEmailAddress3}
                id="emailAddress3"
                label="Adresse e-mail"
                type="email"
                fullWidth              
                error={emailAddress3 != null && (!validated && !emailValidator.validate(emailAddress3))}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={forVendorOnly}
                onChange={this.handleChangeForVendorOnly}
                value="checkedA"
                color="primary"
              />
            }
            label="Disponible uniquement pour les caissiers"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Annuler
          </Button>
          <Button onClick={this.handleValidated} color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddSupplier);
