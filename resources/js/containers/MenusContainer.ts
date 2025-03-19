import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import Menus from "../components/Menus/Menus";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  userLanguage: state.user.userLanguage,
  userToken: state.user.userToken,
  userType: state.user.userType,
  userValidity: state.user.userValidity,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  supplierList: state.supplier.supplierList,
  menuList: state.menu.menuList,
  categoryList: state.category.categoryList,
  cartList: state.cart.cartList,
  orderListTotalCount: state.order.orderListTotalCount
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menus);
