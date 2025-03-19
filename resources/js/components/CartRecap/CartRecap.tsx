import React from "react";
import moment from "moment";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles, Theme } from "@material-ui/core/styles";
import ISetting from "../../interfaces/ISetting";
import DateSort from "../../utils/DateSort/DateSort";
import 'date-fns';
import format from "date-fns/format";
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import fr from "date-fns/locale/fr";
import axios from "axios";
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from 'material-ui-pickers';

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date:any) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

const styles = (theme: Theme) => ({
  messagesError: {
    color: "red"
  },
  card: {
    width: "33.33%",
    margin: `${theme.spacing.unit * 6}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 6}px ${theme.spacing.unit * 3}px`,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  h4: {
    marginTop: `${theme.spacing.unit * 3}px`
  },
  div: {
    display: "flex",
    justifyContent: "center"
  }

});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  is_away: boolean;
  totalPricing: number;
  cart_list: any;
  userType: string;
  userLanguage: string;
  settingList: ISetting[];
  serverTime: string;
  onValidateShoppingCart: (date: string) => void;
  onContinueShopping: () => void;
  checkDictionnary: (tag: string) => string;

}

class CartRecap extends React.Component<IProvidedProps & IProps> {
  state = {
    selectedDay: moment().isoWeekday() - 1,
    selectedDate: new Date(),
    hideTimeLabel: false,
    hideAwayLabel: false,
    is_away: false,
    away_message: ""
  };

  getServerTime = async () => {
    let res = await axios({
      method: "get",
      url: "/api/orders/check_time/",
      withCredentials: true
    });

    let { data } = await res;
    this.setState({ serverTime: data });
 };
getAwayTime = async (date:any) => {
      let res = await axios({
            method: "get",
            url: "/api/suppliers/list/",
            withCredentials: true
        });
      console.log('HERRE',this.props.cart_list)
      let {data} = await res;
      var is_away = false;
      var away_message = "";
      let moment_date = moment(date);
      var list_id_supplier:any = []
      this.props.cart_list.forEach((item:any) => {
            data.forEach((element: { away_start: any; away_end: any; name:any; id:any; }) => {
              console.log('HERRE',element.id)
              if (item.menu.supplier_id == element.id) {
                        console.log('date',moment_date);
                        console.log('element',element);
                        if (element.away_start && element.away_end) {
                            if (moment_date.isBetween(element.away_start,element.away_end)&& !list_id_supplier.includes(element.id)) {
                              list_id_supplier.push(element.id)
                              is_away = true;
                                away_message += `Le fournisseur ${element.name} est en congé du ${element.away_start} au ${element.away_end} veuillez supprimer de votre panier les produits qui ne sont pas disponibles dans cette période. \n\n`;
                            }
                        }
                    }
                })
            }
        )
      this.state.is_away = is_away;
      if (is_away) {
        this.setState({
            away_message: away_message,
         hideAwayLabel: false,
        });
      }
      else {
        this.setState({
          hideAwayLabel: true,
          away_message: ""
        });
      }
        this.setState({is_away});

  console.log('is_away',this.state.is_away);
    };
  handleDateChange = (date:any) => {
    this.getServerTime();
    this.getAwayTime(date);
    this.setState({ selectedDate: date });

    let today=new Date();

    if (moment(date).format("MM-DD-YYYY") != moment(today).format("MM-DD-YYYY")) {
      this.setState({
        hideTimeLabel: true
      });
    } else {
      this.setState({
        hideTimeLabel: false
      });
    }

  };

  handleChangeSelectedDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    this.setState({
      selectedDay: value
    });
  };

  isCartValidable = () => {
    const { userType, settingList, serverTime } = this.props;
    const { selectedDay, selectedDate } = this.state;

    if (this.state.is_away) {
        return false;
    }
    let validation_status = false;

    if (userType === "supplier") {
      return false;
    }

    if (settingList && settingList.length > 0) {
      try{
        const orderDate = moment(selectedDate).format("MM-DD-YYYY") + " " + settingList[0].time_limit;

        let startDate = moment(serverTime);
        let endDate = orderDate;

        if (!startDate || !moment(startDate).isValid()) {
          return false;
        }

        if (!endDate || !moment(moment(endDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")).isValid()) {
          return false;
        }

        startDate = startDate.subtract(2, 'hour');
        validation_status = startDate.isBefore(moment(moment(endDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss")));

        return validation_status;

      }catch(e){
        alert('An error occured while validating cart');
    }

    } else {

      return validation_status;

    }
  };

  renderTimeLimitLabel = () => {
    const { settingList, serverTime } = this.props;
    const { selectedDate } = this.state;

    let text = "";
    if (settingList && settingList.length > 0) {
      text = this.props.checkDictionnary("_HEURE_LIMITE");
      const orderDate = moment(settingList[0].time_limit, "HH:mm:ss").format(
        "HH:mm"
      );

      text = `${text} ${orderDate}`;
    }
    return text;
  }

  handleValidateShoppingCart = () => {
    const { settingList } = this.props;
    const { selectedDay, selectedDate } = this.state;

    const orderDate =
      moment(selectedDate).format("MM-DD-YYYY") + " " + settingList[0].time_limit;

      const startDate = moment(orderDate, "MM-DD-YYYY HH:mm:ss").format(
      "MM-DD-YYYY HH:mm:ss"
    );

    this.props.onValidateShoppingCart(startDate);
  };

  render() {
    const { totalPricing, classes, serverTime, userLanguage } = this.props;
    const { selectedDate, selectedDay, hideTimeLabel,hideAwayLabel } = this.state;
    const today = new Date();
    const delivery_title = this.props.checkDictionnary("_LIVRAISON")+" :";
    const locale = (userLanguage==='fr') ? fr : null;
    const cancelLabel = (userLanguage==='fr') ? 'annuler' : 'cancel';

    return (
      <div className={classes.div}>
        <Card className={classes.card} raised>
          <CardMedia>
            <Typography
              gutterBottom
              variant="h4"
              component="h3"
              className={classes.h4}
            >
              Total :{" "}
              {totalPricing.toLocaleString("fr", {
                minimumFractionDigits: 2
              })}{" "}
              €
            </Typography>
          </CardMedia>
          <CardContent>
          <MuiPickersUtilsProvider utils={LocalizedUtils} locale={locale}>
        <Grid container spacing={8} alignItems="center">
        <Grid item xs={12}>
                <FormControl style={{ width: "100%" }}>
          <DatePicker
            margin="normal"
            label={delivery_title}
            value={selectedDate}
            onChange={this.handleDateChange}
            disablePast={true}
            format="d MMMM yyyy"
            cancelLabel={cancelLabel}
          />
          </FormControl>
          </Grid>
          </Grid>
          </MuiPickersUtilsProvider>
            <Grid container spacing={8} alignItems="center">
              <Grid item xs={12}>
                <Typography
                  className={`${hideTimeLabel ? 'hide-me' : ''}`}
                  component="p"
                  variant="subtitle2"
                  color="secondary"
                  style={{ marginTop: "1rem" }}
                >
                  {this.renderTimeLimitLabel()}
                </Typography>
                  <Typography
                  className={`${hideAwayLabel ? 'hide-me' : ''}`}

                  component="p"
                  variant="subtitle2"
                  color="secondary"
                  style={{ marginTop: "1rem", 'white-space': "pre-wrap" }}
                >
                    {this.state.away_message}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={this.props.onContinueShopping}
            >
              {this.props.checkDictionnary("_CONTINUER_MES_ACHATS")}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.handleValidateShoppingCart()}
              disabled={!this.isCartValidable()}
            >
              {this.props.checkDictionnary("_VALIDER_MA_COMMANDE")}
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(CartRecap);
