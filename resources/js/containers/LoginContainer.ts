import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import Login from "../components/Login/Login";

const mapStateToProps = (state: any) => ({
  isLoginPending: state.login.isLoginPending,
  isLoginSuccess: state.login.isLoginSuccess,
  loginError: state.login.loginError,
  isListPending: state.list.isListPending,
  isEditPending: state.edit.isEditPending,
  isEditSuccess: state.edit.isEditSuccess,
  editError: state.edit.editError,
  userLanguage: state.user.userLanguage,
  dictionnaryList: state.dictionnary.dictionnaryList
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
