import { useSelector } from "react-redux";
import { RootState } from "../types/redux";
import App from "../components/App/App";

const AppContainer = () => {
  const isLoginSuccess = useSelector((state: RootState) => state.login.isLoginSuccess);

  return <App />;
};

export default AppContainer; 