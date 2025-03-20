import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import ManageMenus from "../components/ManageMenus/ManageMenus";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  isAddSuccess: state.add.isAddSuccess,
  isEditSuccess: state.edit.isEditSuccess,
  isDeleteSuccess: state.delete.isDeleteSuccess,
  userType: state.user.userType,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  supplierList: state.supplier.supplierList,
  menuList: state.menu.menuList,
  categoryList: state.category.categoryList,
  allergyList: state.allergy.allergyList,
  menuSizeList: state.menuSize.menuSizeList,
  extraList: state.extra.extraList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageMenus);
