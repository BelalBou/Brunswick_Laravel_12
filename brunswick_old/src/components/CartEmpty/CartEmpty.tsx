import React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import emptyCart from "../../images/empty-cart.svg";

const styles = (theme: Theme) => ({
  div: {
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

const CartEmpty = ({ classes, checkDictionnary }: IProvidedProps & IProps) => (
  <div className={classes.div}>
    <img src={emptyCart} className={classes.img} />
    <Typography
      variant="h5"
      align="center"
      color="textPrimary"
      gutterBottom
      className={classes.h5}
    >
      {checkDictionnary("_PANIER_VIDE")}
      <Typography
        variant="body2"
        color="textSecondary"
        gutterBottom
        paragraph
        className={classes.body2}
      >
        {checkDictionnary("_SI_REMPLIR_PANIER")}
      </Typography>
    </Typography>
  </div>
);

export default withStyles(styles, { withTheme: true })(CartEmpty);
