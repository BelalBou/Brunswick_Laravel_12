import React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import emptyCart from "../../images/empty-cart.svg";

const styles = (theme: Theme) =>
  createStyles({
    div: {
      textAlign: "center",
      display: "block",
      width: "100%"
    },
    h5: {
      padding: theme.spacing.unit * 4
    },
    img: {
      width: "128px",
      paddingTop: theme.spacing.unit * 6
    },
    body2: {
      paddingTop: theme.spacing.unit * 2
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  checkDictionnary: (tag: string) => string;
}

const OrdersEmpty = ({
  classes,
  checkDictionnary
}: IProvidedProps & IProps) => (
  <div className={classes.div}>
    <img src={emptyCart} className={classes.img} />
    <Typography
      variant="h5"
      align="center"
      color="textPrimary"
      gutterBottom
      className={classes.h5}
    >
      {checkDictionnary("_COMMANDES_VIDE")}
      <Typography
        variant="body2"
        color="textSecondary"
        gutterBottom
        paragraph
        className={classes.body2}
      >
        {checkDictionnary("_SI_PASSER_COMMANDE")}
      </Typography>
    </Typography>
  </div>
);

export default withStyles(styles, { withTheme: true })(OrdersEmpty);
