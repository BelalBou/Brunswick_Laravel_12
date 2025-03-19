import React from "react";
import { Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import List from "@material-ui/core/List";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import OrdersListItem from "../OrdersListItem/OrdersListItem";
import OrdersEmpty from "../OrdersEmpty/OrdersEmpty";
import ICart from "../../interfaces/ICart";
import IOrder from "../../interfaces/IOrder";
import IOrderExtra from "../../interfaces/IOrderExtra";

const styles = (theme: Theme) =>
  createStyles({
    list: {
      width: "100%",
      textAlign: "center"
    },
    circularProgress: {
      marginTop: theme.spacing.unit * 2
    },
    button: {
      marginTop: theme.spacing.unit * 2
    }
  });

interface IProvidedProps {
  classes: any;
}

interface IProps {
  userLanguage: string;
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
  hasMore: boolean;
  isListPending: boolean;
  onOpenDelete: (id: number) => void;
  onOpenEdit: (cart: ICart) => void;
  onFetchNextData: () => void;
  checkDictionnary: (tag: string) => string;
  isOrderEditable: (date: string) => boolean;
}

function OrdersList(props: IProvidedProps & IProps) {
  function renderLoaders() {
    const { isListPending, classes } = props;
    if (isListPending) {
      return (
        <CircularProgress disableShrink className={classes.circularProgress} />
      );
    }
  }

  function renderMoreOrdersButton() {
    if (props.hasMore && !props.isListPending) {
      return (
        <Button
          variant="text"
          onClick={props.onFetchNextData}
          className={props.classes.button}
        >
          Charger plus de commandes...
        </Button>
      );
    }
  }

  if (props.orderList && props.orderList.length > 0) {
    return (
      <List className={props.classes.list}>
        {props.orderList.map(order => (
          <OrdersListItem
            key={order.id}
            order={order}
            userLanguage={props.userLanguage}
            orderExtraList={props.orderExtraList}
            onOpenDelete={props.onOpenDelete}
            onOpenEdit={props.onOpenEdit}
            isOrderEditable={props.isOrderEditable}
          />
        ))}
        {renderMoreOrdersButton()}
        {renderLoaders()}
      </List>
    );
  }
  return <OrdersEmpty checkDictionnary={props.checkDictionnary} />;
}

export default withStyles(styles)(OrdersList);
