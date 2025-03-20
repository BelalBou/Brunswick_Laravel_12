import React from "react";
import moment from "moment";
import "moment/locale/fr";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Grid from "@mui/material/Grid";

moment.locale("fr");

const StyledDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(2)
}));

const StyledGridItem = styled(Grid)({
  textAlign: "center"
});

interface IProps {
  selectedDate: moment.Moment;
  onChangeSelectedDate: (date: moment.Moment | null) => void;
}

const MenusCarriedAwayFilter: React.FC<IProps> = ({
  selectedDate,
  onChangeSelectedDate
}) => (
  <StyledDiv>
    <Grid container spacing={2} alignItems="center">
      <StyledGridItem item xs>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fr">
          <DatePicker
            label="Date de la commande :"
            format="Do MMMM YYYY"
            value={selectedDate}
            slotProps={{
              actionBar: {
                actions: ['cancel', 'accept'],
              },
            }}
            onChange={(date) => date && onChangeSelectedDate(date)}
          />
        </LocalizationProvider>
      </StyledGridItem>
    </Grid>
  </StyledDiv>
);

export default MenusCarriedAwayFilter;
