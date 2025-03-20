import React, { useState } from "react";
import moment from "moment";
import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import IOrder from "../../interfaces/IOrder";
import IOrderExtra from "../../interfaces/IOrderExtra";
import IExtra from "../../interfaces/IExtra";

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4)
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  paddingRight: theme.spacing(4)
}));

interface IProps {
  order: IOrder;
  userLanguage: string;
  orderExtraList: IOrderExtra[];
  onOpenDelete: (id: number) => void;
  onOpenEdit: (cart: ICart) => void;
  isOrderEditable: (date: string) => boolean;
}

const OrdersListItem: React.FC<IProps> = ({
  order,
  userLanguage,
  orderExtraList,
  onOpenDelete,
  onOpenEdit,
  isOrderEditable
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleChangeCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const retrieveExtrasForMenu = (menu: IMenu): IExtra[] => {
    const extras: IExtra[] = [];
    if (orderExtraList && orderExtraList.length > 0) {
      const filteredOrderExtraList = orderExtraList.filter(
        orderExtra => orderExtra.order_menu_id === menu.order_menu[0].id
      );
      if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
        filteredOrderExtraList.forEach(orderExtra => {
          const extraObj: IExtra = {
            id: orderExtra.Extra?.id || 0,
            title: orderExtra.Extra?.title || "",
            title_en: orderExtra.Extra?.title_en || "",
            pricing: orderExtra.pricing,
            supplier_id: orderExtra.Extra?.supplier_id || 0,
            menu_size_id: orderExtra.Extra?.menu_size_id || 0,
            MenuSize: orderExtra.Extra?.MenuSize || null
          };
          extras.push(extraObj);
        });
      }
    }
    return extras;
  };

  const calculateTotalPricingForMenu = (menu: IMenu): number => {
    let pricing = parseFloat(menu.order_menu[0].pricing) * menu.order_menu[0].quantity;
    if (orderExtraList && orderExtraList.length > 0) {
      const filteredOrderExtraList = orderExtraList.filter(
        x => x.order_menu_id === menu.order_menu[0].id
      );
      if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
        filteredOrderExtraList.forEach(orderExtra => {
          pricing += parseFloat(orderExtra.pricing) * menu.order_menu[0].quantity;
        });
      }
    }
    return pricing;
  };

  const calculateTotalPricing = (): number => {
    if (!order.Menu || order.Menu.length === 0) return 0;
    
    return order.Menu.reduce((total: number, menu: IMenu) => {
      let pricingTmp = parseFloat(menu.order_menu[0].pricing) * menu.order_menu[0].quantity;
      if (orderExtraList && orderExtraList.length > 0) {
        const filteredOrderExtraList = orderExtraList.filter(
          x => x.order_menu_id === menu.order_menu[0].id
        );
        if (filteredOrderExtraList && filteredOrderExtraList.length > 0) {
          filteredOrderExtraList.forEach(orderExtra => {
            pricingTmp += parseFloat(orderExtra.pricing) * menu.order_menu[0].quantity;
          });
        }
      }
      return total + pricingTmp;
    }, 0);
  };

  const pricing = calculateTotalPricing();

  return (
    <>
      <ListItem onClick={handleChangeCollapsed}>
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
            disabled={!isOrderEditable(order.date)}
            onClick={() => onOpenDelete(order.id)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={collapsed} timeout="auto" unmountOnExit>
        <List disablePadding>
          {order.Menu.map((menu: IMenu, index: number) => (
            <React.Fragment key={menu.id}>
              <StyledListItem
                disabled={!isOrderEditable(order.date)}
                onClick={() =>
                  onOpenEdit({
                    remark: menu.order_menu[0].remark,
                    menu: menu,
                    quantity: menu.order_menu[0].quantity,
                    extras: retrieveExtrasForMenu(menu)
                  })
                }
              >
                <ListItemText
                  primary={userLanguage === "en" ? menu.title_en : menu.title}
                  secondary={
                    menu.menu_size
                      ? userLanguage === "en"
                        ? menu.menu_size.title_en
                        : menu.menu_size.title
                      : "/"
                  }
                />
                <ListItemSecondaryAction>
                  <StyledTypography
                    variant="subtitle1"
                    color="textSecondary"
                    gutterBottom
                  >
                    {calculateTotalPricingForMenu(menu).toLocaleString("fr", {
                      minimumFractionDigits: 2
                    })}{" "}
                    €
                  </StyledTypography>
                </ListItemSecondaryAction>
              </StyledListItem>
              {index < order.Menu.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Collapse>
      <Divider />
    </>
  );
};

export default OrdersListItem;
