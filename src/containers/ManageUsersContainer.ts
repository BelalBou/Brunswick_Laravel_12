import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import ManageUsers from "../components/ManageUsers/ManageUsers";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  isAddSuccess: state.add.isAddSuccess,
  isEditSuccess: state.edit.isEditSuccess,
  isDeleteSuccess: state.delete.isDeleteSuccess,
  addError: state.add.addError,
  userId: state.user.userId,
  userType: state.user.userType,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  selected: state.page.selected,
  dictionnaryList: state.dictionnary.dictionnaryList,
  userList: state.user.userList,
  supplierList: state.supplier.supplierList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageUsers);
