import moment from "moment";
import "moment/locale/fr";
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

moment.locale("fr");

const styles = (theme: Theme) =>
  createStyles({
    div: {
      padding: theme.spacing(2)
    },
    gridItem: {
      textAlign: "center"
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  selectedDate: moment.Moment;
  onChangeSelectedDate: (date: moment.Moment) => void;
}

const MenusCarriedAwayFilter = ({
  selectedDate,
  classes,
  onChangeSelectedDate
}: IProvidedProps & IProps) => (
  <div className={classes.div}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs className={classes.gridItem}>
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          locale={"fr"}
        >
          <DatePicker
            label="Date de la commande :"
            format="Do MMMM YYYY"
            value={selectedDate}
            cancelLabel="Annuler"
            okLabel="Valider"
            onChange={onChangeSelectedDate}
          />
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles, { withTheme: true })(MenusCarriedAwayFilter);
