import React, { Component } from "react";
import moment from "moment";
import "moment/locale/fr";
import emailValidator from "email-validator";
import { withStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

moment.locale("fr");

const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  timeLimit: string;
  startPeriod: number;
  endPeriod: number;
  emailOrderCc: string;
  emailSupplierCc: string;
  emailVendorCc: string;
  onClose: () => void;
  onEdit: (
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => void;
}

interface IState {
  timeLimit: string;
  startPeriod: number;
  endPeriod: number;
  emailOrderCc: string;
  emailSupplierCc: string;
  emailVendorCc: string;
  validated: boolean;
}

class EditSetting extends Component<IProvidedProps & IProps, IState> {
  state = {
    timeLimit: this.props.timeLimit,
    startPeriod: this.props.startPeriod,
    endPeriod: this.props.endPeriod,
    emailOrderCc: this.props.emailOrderCc,
    emailSupplierCc: this.props.emailSupplierCc,
    emailVendorCc: this.props.emailVendorCc,
    validated: true
  };

  handleChangeTimeLimit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      timeLimit: value
    });
  };

  handleChangeStartPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      startPeriod: parseInt(value)
    });
  };

  handleChangeEndPeriod = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      endPeriod: parseInt(value)
    });
  };

  handleChangeEmailOrderCc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      emailOrderCc: value.trim().toLowerCase()
    });
  };

  handleChangeEmailSupplierCc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    this.setState({
      emailSupplierCc: value.trim().toLowerCase()
    });
  };

  handleChangeEmailVendorCc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    this.setState({
      emailVendorCc: value.trim().toLowerCase()
    });
  };

  handleValidateEmailAddress = (emailAddresses: string[]) => {
    if (emailAddresses && emailAddresses.length > 0) {
      return emailAddresses
        .map(emailAddress => emailValidator.validate(emailAddress))
        .every(x => x === true);
    }
    return false;
  };

  handleValidated = () => {
    const {
      timeLimit,
      startPeriod,
      endPeriod,
      emailOrderCc,
      emailSupplierCc,
      emailVendorCc
    } = this.state;
    if (
      !timeLimit ||
      !this.handleValidateEmailAddress(emailOrderCc.split(";")) ||
      !this.handleValidateEmailAddress(emailSupplierCc.split(";")) ||
      !this.handleValidateEmailAddress(emailVendorCc.split(";"))
    ) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onEdit(
        timeLimit,
        startPeriod,
        endPeriod,
        emailOrderCc,
        emailSupplierCc,
        emailVendorCc
      );
    }
  };

  handlePeriodSelect = () => {
    return Array.from(Array(7).keys()).map(x => (
      <MenuItem key={x} value={x} className="capitalized-text">
        {moment.weekdays(true)[x]}
      </MenuItem>
    ));
  };

  render() {
    const {
      timeLimit,
      startPeriod,
      endPeriod,
      emailOrderCc,
      emailSupplierCc,
      emailVendorCc,
      validated
    } = this.state;
    const { classes } = this.props;
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Éditer un paramètre</DialogTitle>
        <DialogContent>
          <TextField
            id="timeLimit"
            label="Heure limite"
            type="time"
            value={this.state.timeLimit}
            onChange={this.handleChangeTimeLimit}
            autoFocus
            defaultValue="11:00"
            className={classes.margin}
            InputLabelProps={{
              shrink: true
            }}
            inputProps={{
              step: 900
            }}
            fullWidth
            required
            error={!validated && !timeLimit}
          />
          <Grid container spacing={8}>
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth required>
                <InputLabel htmlFor="category">Jour de début</InputLabel>
                <Select
                  value={startPeriod}
                  onChange={this.handleChangeStartPeriod}
                  inputProps={{
                    name: "startPeriod",
                    id: "startPeriod",
                    className: "capitalized-text"
                  }}
                >
                  {this.handlePeriodSelect()}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs>
              <FormControl className={classes.margin} fullWidth required>
                <InputLabel htmlFor="category">Jour de fin</InputLabel>
                <Select
                  value={endPeriod}
                  onChange={this.handleChangeEndPeriod}
                  inputProps={{
                    name: "endPeriod",
                    id: "endPeriod",
                    className: "capitalized-text"
                  }}
                >
                  {this.handlePeriodSelect()}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            className={classes.margin}
            id="standard-multiline-flexible"
            label="E-mails commandes"
            multiline
            rowsMax="4"
            value={emailOrderCc}
            onChange={this.handleChangeEmailOrderCc}
            fullWidth
            required
            error={
              !validated &&
              !this.handleValidateEmailAddress(emailOrderCc.split(";"))
            }
            helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
          />
          <TextField
            className={classes.margin}
            id="standard-multiline-flexible"
            label="E-mails fournisseurs"
            multiline
            rowsMax="4"
            value={emailSupplierCc}
            onChange={this.handleChangeEmailSupplierCc}
            fullWidth
            required
            error={
              !validated &&
              !this.handleValidateEmailAddress(emailSupplierCc.split(";"))
            }
            helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
          />
          <TextField
            className={classes.margin}
            id="standard-multiline-flexible"
            label="E-mails caissiers"
            multiline
            rowsMax="4"
            value={emailVendorCc}
            onChange={this.handleChangeEmailVendorCc}
            fullWidth
            required
            error={
              !validated &&
              !this.handleValidateEmailAddress(emailVendorCc.split(";"))
            }
            helperText="Le caractère « ; » doit être utilisé afin de séparer plusieurs adresses e-mails"
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

export default withStyles(styles)(EditSetting);
