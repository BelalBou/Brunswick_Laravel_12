import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../actions";
import App from "../components/App/App";

const mapStateToProps = (state: any) => ({
  isLoginSuccess: state.login.isLoginSuccess
});

function mapDispatchToProps(dispatch: any) {
  return {
    actions: bindActionCreators<any, any>(Actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
