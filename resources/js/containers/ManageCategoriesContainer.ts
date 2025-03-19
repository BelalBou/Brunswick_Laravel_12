import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import ManageCategories from "../components/ManageCategories/ManageCategories";

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
  categoryList: state.category.categoryList,
  supplierList: state.supplier.supplierList,
  menuList: state.menu.menuList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCategories);
