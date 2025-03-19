import { useSelector } from "react-redux";
import App from "../components/App/App";

const AppContainer = () => {
  const isLoginSuccess = useSelector((state: RootState) => state.login.isLoginSuccess);

  return <App />;
};

export default AppContainer; 