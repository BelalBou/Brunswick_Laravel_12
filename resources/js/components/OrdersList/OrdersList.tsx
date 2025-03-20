import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import OrdersListItem from "../OrdersListItem/OrdersListItem";
import OrdersEmpty from "../OrdersEmpty/OrdersEmpty";
import ICart from "../../interfaces/ICart";
import IOrder from "../../interfaces/IOrder";
import IOrderExtra from "../../interfaces/IOrderExtra";

const StyledList = styled(List)({
  width: "100%",
  textAlign: "center"
});

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2)
}));

interface IProps {
  userLanguage: string;
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
  hasMore: boolean;
  isListPending: boolean;
  onOpenDelete: (orderId: number) => void;
  onOpenEdit: (cart: ICart) => void;
  onFetchNextData: () => void;
  checkDictionnary: (tag: string) => string;
  isOrderEditable: (date: string) => boolean;
}

const OrdersList: React.FC<IProps> = ({
  userLanguage,
  orderList,
  orderExtraList,
  hasMore,
  isListPending,
  onOpenDelete,
  onOpenEdit,
  onFetchNextData,
  checkDictionnary,
  isOrderEditable
}) => {
  const renderLoaders = () => {
    if (isListPending) {
      return <StyledCircularProgress disableShrink />;
    }
  };

  const renderMoreOrdersButton = () => {
    if (hasMore && !isListPending) {
      return (
        <StyledButton variant="text" onClick={onFetchNextData}>
          Charger plus de commandes...
        </StyledButton>
      );
    }
  };

  if (orderList && orderList.length > 0) {
    return (
      <StyledList>
        {orderList.map(order => (
          <OrdersListItem
            key={order.id}
            order={order}
            userLanguage={userLanguage}
            orderExtraList={orderExtraList}
            onOpenDelete={onOpenDelete}
            onOpenEdit={onOpenEdit}
            isOrderEditable={isOrderEditable}
          />
        ))}
        {renderMoreOrdersButton()}
        {renderLoaders()}
      </StyledList>
    );
  }

  return <OrdersEmpty checkDictionnary={checkDictionnary} />;
};

export default OrdersList;
