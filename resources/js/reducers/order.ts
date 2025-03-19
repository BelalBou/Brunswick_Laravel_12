import {
  SET_ORDER_LIST,
  SET_ORDER_LIST_SPREAD,
  SET_ORDER_EXTRA_LIST,
  SET_ORDER_LIST_TOTAL_COUNT,
  OrderAction
} from "../actions/order";
import IOrder from "../interfaces/IOrder";
import IOrderExtra from "../interfaces/IOrderExtra";

const initialState = {
  orderList: [],
  orderExtraList: [],
  orderListTotalCount: 0
};

type State = {
  orderList: IOrder[];
  orderExtraList: IOrderExtra[];
  orderListTotalCount: number;
};

const order = (state: State = initialState, action: OrderAction) => {
  switch (action.type) {
    case SET_ORDER_LIST:
      return Object.assign({}, state, {
        orderList: action.payload.data.result
      });
    case SET_ORDER_LIST_SPREAD:
      return Object.assign({}, state, {
        orderList: [...state.orderList, ...action.payload.data.result]
      });
    case SET_ORDER_EXTRA_LIST:
      return Object.assign({}, state, {
        orderExtraList: action.payload.data
      });
    case SET_ORDER_LIST_TOTAL_COUNT:
      return Object.assign({}, state, {
        orderListTotalCount: action.payload.data.totalCount
      });
    default:
      return state;
  }
};

export default order;
