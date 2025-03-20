import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import Account from "../components/Account/Account";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess,
  isListPending: state.list.isListPending,
  userId: state.user.userId,
  userFirstName: state.user.userFirstName,
  userLastName: state.user.userLastName,
  userEmailAddress: state.user.userEmailAddress,
  userType: state.user.userType,
  userToken: state.user.userToken,
  userLanguage: state.user.userLanguage,
  selected: state.page.selected,
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
)(Account);
