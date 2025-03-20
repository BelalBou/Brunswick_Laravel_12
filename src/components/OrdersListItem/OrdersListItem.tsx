import React, { Fragment } from "react";
import moment from "moment";
import { withStyles, Theme } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import IOrder from "../../interfaces/IOrder";
import IOrderExtra from "../../interfaces/IOrderExtra";
import IExtra from "../../interfaces/IExtra";

const styles = (theme: Theme) => ({
  nestedLeft: {
    paddingLeft: theme.spacing.unit * 4
  },
  nestedRight: {
    paddingRight: theme.spacing.unit * 4
  }
});

interface IProvidedProps {
  classes: any;
}

interface IProps {
  order: IOrder;
  userLanguage: string;
  orderExtraList: IOrderExtra[];
  onOpenDelete: (id: number) => void;
  onOpenEdit: (cart: ICart) => void;
  isOrderEditable: (date: string) => boolean;
}

interface IState {
  collapsed: boolean;
}

class OrdersListItem extends React.Component<IProvidedProps & IProps, IState> {
  state = {
    collapsed: false
  };

  handleChangeCollapsed = () => {
    this.setState(state => {
      return {
        collapsed: !state.collapsed
      };
    });
  };

  retrieveExtrasForMenu = (menu: IMenu) => {
    const { orderExtraList } = this.props;
    const extras = [] as IExtra[];
    if (orderExtraList && orderExtraList.length > 0) {
      const filteredOrderExtraList = orderExtraList.filter(
        orderExtra => orderExtra.order_menu_id === menu.order_menus.id
      );
      if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
        filteredOrderExtraList.map(orderExtra => {
          const extraObj = {} as IExtra;
          extraObj.title = orderExtra.Extra ? orderExtra.Extra.title : "";
          extraObj.title_en = orderExtra.Extra ? orderExtra.Extra.title_en : "";
          extraObj.pricing = orderExtra.pricing;
          extras.push(extraObj);
        });
      }
    }
    return extras;
  };

  calculateTotalPricingForMenu = (menu: IMenu) => {
    const { orderExtraList } = this.props;
    let pricing =
      parseFloat(menu.order_menus.pricing) * menu.order_menus.quantity;
    if (orderExtraList && orderExtraList.length > 0) {
      const filteredOrderExtraList = orderExtraList.filter(
        x => x.order_menu_id === menu.order_menus.id
      );
      if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
        filteredOrderExtraList.map(orderExtra => {
          pricing += parseFloat(orderExtra.pricing) * menu.order_menus.quantity;
        });
      }
    }
    return pricing;
  };

  render() {
    const { order, userLanguage, orderExtraList, classes } = this.props;
    const { collapsed } = this.state;
    let pricing = 0;
    if (order.Menu && order.Menu.length > 0) {
      const pricingArray = order.Menu.map((menu: IMenu) => {
        let pricingTmp =
          parseFloat(menu.order_menus.pricing) * menu.order_menus.quantity;
        if (orderExtraList && orderExtraList.length > 0) {
          const filteredOrderExtraList = orderExtraList.filter(
            x => x.order_menu_id === menu.order_menus.id
          );
          if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
            filteredOrderExtraList.map(orderExtra => {
              pricingTmp +=
                parseFloat(orderExtra.pricing) * menu.order_menus.quantity;
            });
          }
        }
        return pricingTmp;
      });
      pricing = pricingArray.reduce((a: number, b: number) => a + b, 0);
    }
    return (
      <>
        <ListItem button onClick={this.handleChangeCollapsed}>
          <ListItemText
            primary={moment(order.date).format("dddd DD MMMM YYYY")}
            secondary={
              <Typography variant="subtitle1" color="textSecondary">
                {`${pricing.toLocaleString("fr", {
                  minimumFractionDigits: 2
                })} €`}
              </Typography>
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              color="secondary"
              disabled={!this.props.isOrderEditable(order.date)}
              onClick={() => this.props.onOpenDelete(order.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <Collapse in={collapsed} timeout="auto" unmountOnExit>
          <List disablePadding>
            {order.Menu.map((menu: IMenu, index: number) => (
              <Fragment key={menu.id}>
                <ListItem
                  button
                  disabled={!this.props.isOrderEditable(order.date)}
                  onClick={() =>
                    this.props.onOpenEdit({
                      remark: menu.order_menus.remark,
                      menu: menu,
                      quantity: menu.order_menus.quantity,
                      extras: this.retrieveExtrasForMenu(menu)
                    })
                  }
                  className={classes.nestedLeft}
                >
                  <ListItemText
                    primary={userLanguage === "en" ? menu.title_en : menu.title}
                    secondary={
                      menu.MenuSize
                        ? userLanguage === "en"
                          ? menu.MenuSize.title_en
                          : menu.MenuSize.title
                        : "/"
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      gutterBottom
                      className={classes.nestedRight}
                    >
                      {this.calculateTotalPricingForMenu(menu).toLocaleString(
                        "fr",
                        {
                          minimumFractionDigits: 2
                        }
                      )}{" "}
                      €
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < order.Menu.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </Collapse>
        <Divider />
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(OrdersListItem);
