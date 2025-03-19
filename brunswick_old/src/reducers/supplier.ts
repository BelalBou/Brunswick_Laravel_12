import { SET_SUPPLIER_LIST, SupplierAction } from "../actions/supplier";
import ISupplier from "../interfaces/ISupplier";

const initialState = {
  supplierList: []
};

type State = {
  supplierList: ISupplier[];
};

const supplier = (state: State = initialState, action: SupplierAction) => {
  switch (action.type) {
    case SET_SUPPLIER_LIST:
      return Object.assign({}, state, {
        supplierList: action.payload.data
      });
    default:
      return state;
  }
};

export default supplier;
