import React from "react";
import moment from "moment";
import "moment/locale/fr";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { withStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IntegratedReactSelect from "../IntegratedReactSelect/IntegratedReactSelect";
import ISelect from "../../interfaces/ISelect";

moment.locale("fr");

const styles = (theme: Theme) => ({
  padding: {
    padding: theme.spacing.unit * 2
  },
  datePicker: {
    marginTop: theme.spacing.unit / 2
  }
});

interface IProvidedProps {
  classes: any;
  theme: Theme;
}

interface IProps {
  suppliers: ISelect[];
  customers: ISelect[];
  userType: string;
  selectedDate: moment.Moment | null;
  selectedSuppliers: ISelect[];
  selectedCustomers: ISelect[];
  handleToday: boolean;
  handleSuppliers: boolean;
  handleCustomers: boolean;
  onChangeDate: (date: moment.Moment) => void;
  onChangeSuppliers: (suppliers: ISelect[]) => void;
  onChangeCustomers: (customers: ISelect[]) => void;
}

const OrdersFilters = (props: IProvidedProps & IProps) => (
  <div className={props.classes.padding}>
    <Grid container spacing={16} alignItems="center">
      {props.handleToday && (
        <Grid item xs>
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            locale={"fr"}
            moment={moment}
          >
            <DatePicker
              format="Do MMMM YYYY"
              value={props.selectedDate}
              onChange={props.onChangeDate}
              placeholder="Filtrer par date..."
              fullWidth
              clearable
              clearLabel="Réinitialiser"
              cancelLabel="Annuler"
              okLabel="Valider"
              className={props.classes.datePicker}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      )}
      {props.handleSuppliers && (
        <Grid item xs>
          {/*<IntegratedReactSelect*/}
          {/*  placeholder="Filtrer par fournisseurs..."*/}
          {/*  value={props.selectedSuppliers}*/}
          {/*  onChange={props.onChangeSuppliers}*/}
          {/*  options={props.suppliers}*/}
          {/*  isMulti*/}
          {/*  isClearable*/}
          {/*/>*/}
        </Grid>
      )}
      {props.handleCustomers && (
        <Grid item xs>
          {/*<IntegratedReactSelect*/}
          {/*  placeholder="Filtrer par clients..."*/}
          {/*  value={props.selectedCustomers}*/}
          {/*  onChange={props.onChangeCustomers}*/}
          {/*  options={props.customers}*/}
          {/*  isMulti*/}
          {/*  isClearable*/}
          {/*/>*/}
        </Grid>
      )}
    </Grid>
  </div>
);

export default withStyles(styles, { withTheme: true })(OrdersFilters);
