import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import ManageExtras from "../components/ManageExtras/ManageExtras";

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
  extraList: state.extra.extraList,
  supplierList: state.supplier.supplierList,
  menuSizeList: state.menuSize.menuSizeList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageExtras);
