import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import Orders from "../components/Orders/Orders";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  isEditSuccess: state.edit.isEditSuccess,
  isDeleteSuccess: state.delete.isDeleteSuccess,
  userId: state.user.userId,
  userType: state.user.userType,
  userSupplierId: state.user.userSupplierId,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  orderList: state.order.orderList,
  orderExtraList: state.order.orderExtraList,
  orderListTotalCount: state.order.orderListTotalCount,
  supplierList: state.supplier.supplierList,
  userList: state.user.userList,
  settingList: state.setting.settingList,
  cartList: state.cart.cartList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);
