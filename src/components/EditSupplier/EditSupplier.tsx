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
import moment from "moment";
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';
import FormControl from "@material-ui/core/FormControl";
import DateFnsUtils from "@date-io/date-fns";
import format from "date-fns/format";
import fr from "date-fns/locale/fr";
class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date:any) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}
const styles = (theme: Theme) => ({
  margin: {
    margin: theme.spacing.unit
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  name: string;
  emailAddress: string;
  emailAddress2: string;
  emailAddress3: string;
  forVendorOnly: boolean;
  awayStart: moment.Moment,
  awayEnd: moment.Moment,
  onClose: () => void;
  onEdit: (name: string, emailAddress: string, emailAddress2: string, emailAddress3: string, forVendorOnly: boolean,awayStart: moment.Moment,awayEnd: moment.Moment) => void;
}

interface IState {
  name: string;
  awayStart: moment.Moment,
  awayEnd: moment.Moment,
  emailAddress: string;
  emailAddress2: string;
  emailAddress3: string;
  forVendorOnly: boolean;
  validated: boolean;
}

class EditSupplier extends Component<IProvidedProps & IProps, IState> {
  state = {
    name: this.props.name,
    awayStart:this.props.awayStart,
    awayEnd:this.props.awayEnd,
    emailAddress: this.props.emailAddress,
    emailAddress2: this.props.emailAddress2,
    emailAddress3: this.props.emailAddress3,
    forVendorOnly: this.props.forVendorOnly,
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

  handleAwayStartChange = (date:any) => {
    this.setState({ awayStart: date });


  };
  handleAwayEndChange = (date:any) => {
    this.setState({ awayEnd: date });


  };
  handleChangeForVendorOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    this.setState({
      forVendorOnly: checked
    });
  };

  handleValidated = () => {
    const { name, emailAddress, emailAddress2, emailAddress3, forVendorOnly, awayStart, awayEnd } = this.state;
    if (!name || !emailValidator.validate(emailAddress) || (emailAddress2 && !emailValidator.validate(emailAddress2)) || (emailAddress3 && !emailValidator.validate(emailAddress3))) {
      this.setState({
        validated: false
      });
    } else {
      this.props.onEdit(name, emailAddress, emailAddress2, emailAddress3, forVendorOnly,awayStart,awayEnd);
      // const dateDebut = moment(awayStart).format("YYYY-MM-DD");
      // const dateFin = moment(awayEnd).format("YYYY-MM-DD");
      localStorage.setItem("cartList", JSON.stringify([]));     

      // let cartList = [];
      // cartList.push(localStorage.getItem("cartList"));  
      // console.log(cartList);   

      // if (cartList != null) {

      //   JSON.parse(cartList).forEach((el)=>{
      //     console.log(el);
      //     if (el.menu.Supplier.name === name) {
      //       el.menu.Supplier.away_start = dateDebut;
      //       el.menu.Supplier.away_end = dateFin;           
      //     }
      //   })     
          
      //   localStorage.removeItem('cartList');
      //   localStorage.setItem("cartList", JSON.stringify(cartList));      
      // }

      window.location.reload();
    }    
  };

  render() {
    const { name, emailAddress, emailAddress2, emailAddress3, forVendorOnly, validated, awayStart, awayEnd } = this.state;
    const { classes } = this.props;
    const locale = fr;
    const cancelLabel = 'annuler';
    return (
      <Dialog
        open
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Éditer un fournisseur</DialogTitle>
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
                required
                error={!validated && !emailValidator.validate(emailAddress2)}
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
                required
                error={!validated && !emailValidator.validate(emailAddress3)}
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
          <MuiPickersUtilsProvider utils={LocalizedUtils} locale={locale}>

            <Grid item xs >
              <FormControl >
                <DatePicker
                    margin="normal"
                    label="Depart de vacance"
                    value={awayStart}
                    onChange={this.handleAwayStartChange}
                    disablePast={true}
                    format="d MMMM yyyy"
                    cancelLabel="Annuler"
                />
              </FormControl>
            </Grid>
            <Grid item xs >
              <FormControl >
                <DatePicker
                    margin="normal"
                    label="Retour de vacance"
                    value={awayEnd}
                    onChange={this.handleAwayEndChange}
                    disablePast={true}
                    format="d MMMM yyyy"
                    cancelLabel="Annuler"
                />
              </FormControl>
            </Grid>
          </MuiPickersUtilsProvider>
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
            Éditer
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditSupplier);
