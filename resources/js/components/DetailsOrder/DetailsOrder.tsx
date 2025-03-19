import React from "react";
import { withStyles, Theme, createStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import CartTable from "../CartTable/CartTable";
import ICart from "../../interfaces/ICart";
import IMenu from "../../interfaces/IMenu";
import IExtra from "../../interfaces/IExtra";
import IOrderExtra from "../../interfaces/IOrderExtra";
import IOrder from "../../interfaces/IOrder";

const styles = (theme: Theme) =>
  createStyles({
    h5: {
      padding: theme.spacing.unit * 4
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  title: string;
  order: IOrder;
  userType: string;
  userLanguage: string;
  editable: boolean;
  orderExtraList: IOrderExtra[];
  onClose: () => void;
  onEditShoppingCart: (item: ICart, quantity: number, remark: string) => void;
  onDeleteShoppingCart: (item: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const DetailsOrder = ({
  title,
  order,
  editable,
  userType,
  userLanguage,
  orderExtraList,
  classes,
  onEditShoppingCart,
  onDeleteShoppingCart,
  onClose,
  checkDictionnary
}: IProvidedProps & IProps) => (
  <Dialog
    maxWidth="lg"
    open
    scroll="body"
    onClose={onClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      {order && (
        <CartTable
          userLanguage={userLanguage}
          cartList={order.Menu.map((menu: IMenu) => {
            const obj = {} as ICart;
            obj.menu = menu;
            obj.quantity = menu.order_menus.quantity;
            obj.remark = menu.order_menus.remark;
            const filteredOrderExtraList = orderExtraList.filter(
              x => x.order_menu_id === menu.order_menus.id
            );
            let extras = [] as IExtra[];
            if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
              extras = filteredOrderExtraList.map(filteredOrderExtra => {
                const extra = {} as IExtra;
                extra.title = filteredOrderExtra.Extra.title;
                extra.title_en = filteredOrderExtra.Extra.title_en;
                extra.pricing = filteredOrderExtra.pricing;
                return extra;
              });
            }
            obj.extras = extras;
            return obj;
          })}
          readOnly={!editable}
          userType={userType}
          onEditShoppingCart={onEditShoppingCart}
          onDeleteShoppingCart={onDeleteShoppingCart}
          checkDictionnary={checkDictionnary}
        />
      )}
      {!order && (
        <Typography
          variant="h5"
          align="center"
          color="textPrimary"
          gutterBottom
          className={classes.h5}
        >
          {checkDictionnary("_COMMANDE_VIDE")}{" "}
          <span role="img" aria-label="sad">
            😞
          </span>
        </Typography>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {checkDictionnary("_FERMER")}
      </Button>
    </DialogActions>
  </Dialog>
);

export default withStyles(styles, { withTheme: true })(DetailsOrder);
