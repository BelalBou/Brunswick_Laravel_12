import React, { useState, useEffect } from "react";
import moment from "moment";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import fr from "date-fns/locale/fr";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import ISetting from "../../interfaces/ISetting";

const StyledCard = styled(Card)(({ theme }) => ({
  width: "33.33%",
  margin: `${theme.spacing(6)}px ${theme.spacing(3)}px ${theme.spacing(6)}px ${theme.spacing(3)}px`,
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3)
}));

const Container = styled('div')({
  display: "flex",
  justifyContent: "center"
});

interface CartRecapProps {
  is_away: boolean;
  totalPricing: number;
  cart_list: any[];
  userType: string;
  userLanguage: string;
  settingList: ISetting[];
  serverTime: string;
  onValidateShoppingCart: (date: string) => void;
  onContinueShopping: () => void;
  checkDictionnary: (tag: string) => string;
}

const CartRecap: React.FC<CartRecapProps> = ({
  totalPricing,
  serverTime,
  userLanguage,
  settingList,
  cart_list,
  userType,
  onValidateShoppingCart,
  onContinueShopping,
  checkDictionnary
}): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [hideTimeLabel, setHideTimeLabel] = useState<boolean>(false);
  const [hideAwayLabel, setHideAwayLabel] = useState<boolean>(false);
  const [isAway, setIsAway] = useState<boolean>(false);
  const [awayMessage, setAwayMessage] = useState<string>("");

  const getServerTime = async (): Promise<void> => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/orders/check_time/",
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      console.error("Error getting server time:", error);
    }
  };

  const getAwayTime = async (date: Date): Promise<void> => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/suppliers/list/",
        withCredentials: true
      });
      const { data } = res;
      let isAwayStatus = false;
      let message = "";
      const momentDate = moment(date);
      const listIdSupplier: number[] = [];

      cart_list.forEach((item) => {
        data.forEach((element: { away_start: string; away_end: string; name: string; id: number }) => {
          if (item.menu.supplier_id === element.id) {
            if (element.away_start && element.away_end) {
              if (momentDate.isBetween(element.away_start, element.away_end) && !listIdSupplier.includes(element.id)) {
                listIdSupplier.push(element.id);
                isAwayStatus = true;
                message += `Le fournisseur ${element.name} est en congé du ${element.away_start} au ${element.away_end} veuillez supprimer de votre panier les produits qui ne sont pas disponibles dans cette période. \n\n`;
              }
            }
          }
        });
      });

      setIsAway(isAwayStatus);
      if (isAwayStatus) {
        setAwayMessage(message);
        setHideAwayLabel(false);
      } else {
        setHideAwayLabel(true);
        setAwayMessage("");
      }
    } catch (error) {
      console.error("Error getting away time:", error);
    }
  };

  const handleDateChange = async (date: Date | null): Promise<void> => {
    if (!date) return;
    
    await getServerTime();
    await getAwayTime(date);
    setSelectedDate(date);

    const today = new Date();
    setHideTimeLabel(moment(date).format("MM-DD-YYYY") !== moment(today).format("MM-DD-YYYY"));
  };

  const isCartValidable = (): boolean => {
    if (isAway) return false;
    if (userType === "supplier") return false;

    if (settingList && settingList.length > 0) {
      try {
        const orderDate = moment(selectedDate).format("MM-DD-YYYY") + " " + settingList[0].time_limit;
        const startDate = moment(serverTime).subtract(2, 'hour');
        const endDate = moment(moment(orderDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));

        if (!startDate.isValid() || !endDate.isValid()) return false;
        return startDate.isBefore(endDate);
      } catch (e) {
        console.error("Error validating cart:", e);
        return false;
      }
    }
    return false;
  };

  const renderTimeLimitLabel = (): string => {
    if (!settingList || settingList.length === 0) return "";
    const text = checkDictionnary("_HEURE_LIMITE");
    const orderDate = moment(settingList[0].time_limit, "HH:mm:ss").format("HH:mm");
    return `${text} ${orderDate}`;
  };

  const handleValidateShoppingCart = (): void => {
    if (!settingList || settingList.length === 0) return;
    
    const orderDate = moment(selectedDate).format("MM-DD-YYYY") + " " + settingList[0].time_limit;
    const startDate = moment(orderDate, "MM-DD-YYYY HH:mm:ss").format("MM-DD-YYYY HH:mm:ss");
    onValidateShoppingCart(startDate);
  };

  const deliveryTitle = checkDictionnary("_LIVRAISON") + " :";
  const locale = userLanguage === 'fr' ? fr : enUS;
  const cancelLabel = userLanguage === 'fr' ? 'annuler' : 'cancel';

  return (
    <Container>
      <StyledCard raised>
        <CardMedia>
          <TitleTypography
            gutterBottom
            variant="h4"
            sx={{ component: 'h3' }}
          >
            Total :{" "}
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </TitleTypography>
        </CardMedia>
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <FormControl style={{ width: "100%" }}>
                  <DatePicker
                    label={deliveryTitle}
                    value={selectedDate}
                    onChange={handleDateChange}
                    disablePast
                    format="d MMMM yyyy"
                    slotProps={{
                      actionBar: {
                        actions: ['cancel', 'accept'],
                      },
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography
                className={hideTimeLabel ? 'hide-me' : ''}
                component="p"
                variant="subtitle2"
                color="secondary"
                style={{ marginTop: "1rem" }}
              >
                {renderTimeLimitLabel()}
              </Typography>
              <Typography
                className={hideAwayLabel ? 'hide-me' : ''}
                component="p"
                variant="subtitle2"
                color="secondary"
                style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}
              >
                {awayMessage}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={onContinueShopping}
          >
            {checkDictionnary("_CONTINUER_MES_ACHATS")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleValidateShoppingCart}
            disabled={!isCartValidable()}
          >
            {checkDictionnary("_VALIDER_MA_COMMANDE")}
          </Button>
        </CardActions>
      </StyledCard>
    </Container>
  );
};

export default CartRecap;
