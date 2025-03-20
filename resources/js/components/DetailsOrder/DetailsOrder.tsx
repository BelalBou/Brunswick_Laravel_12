import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import CartTable from "../CartTable/CartTable";
import ICart from "../../interfaces/ICart";
import IMenu from "../../interfaces/IMenu";
import IExtra from "../../interfaces/IExtra";
import IOrderExtra from "../../interfaces/IOrderExtra";
import IOrder from "../../interfaces/IOrder";

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    minWidth: "800px"
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center"
}));

interface DetailsOrderProps {
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

const DetailsOrder: React.FC<DetailsOrderProps> = ({
  title,
  order,
  editable,
  userType,
  userLanguage,
  orderExtraList,
  onEditShoppingCart,
  onDeleteShoppingCart,
  onClose,
  checkDictionnary
}): JSX.Element => {
  const cartList = React.useMemo(() => {
    if (!order) return [];
    
    return order.Menu.map((menu: IMenu) => {
      const obj = {} as ICart;
      obj.menu = menu;
      obj.quantity = menu.order_menu[0].quantity;
      obj.remark = menu.order_menu[0].remark;
      const filteredOrderExtraList = orderExtraList.filter(
        x => x.order_menu_id === menu.order_menu[0].id
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
    });
  }, [order, orderExtraList]);

  return (
    <StyledDialog
      maxWidth="lg"
      open
      scroll="body"
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {order ? (
          <CartTable
            userLanguage={userLanguage}
            cartList={cartList}
            readOnly={!editable}
            userType={userType}
            onEditShoppingCart={onEditShoppingCart}
            onDeleteShoppingCart={onDeleteShoppingCart}
            checkDictionnary={checkDictionnary}
          />
        ) : (
          <StyledTypography
            variant="h5"
            color="textPrimary"
            gutterBottom
          >
            {checkDictionnary("_COMMANDE_VIDE")}{" "}
            <span role="img" aria-label="sad">
              😞
            </span>
          </StyledTypography>
        )}
      </DialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} color="primary">
          {checkDictionnary("_FERMER")}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default DetailsOrder;
