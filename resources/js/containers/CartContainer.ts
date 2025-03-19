import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import Cart from "../components/Cart/Cart";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  userId: state.user.userId,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  userType: state.user.userType,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  cartList: state.cart.cartList,
  settingList: state.setting.settingList,
  orderListTotalCount: state.order.orderListTotalCount,
  serverTime: state.server_time.serverTimeList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
