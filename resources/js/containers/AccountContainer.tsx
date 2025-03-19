import React from "react";
import { useSelector } from "react-redux";
import Account from "../components/Account/Account";

const AccountContainer: React.FC = () => {
  const {
    isLoginSuccess,
    isPending: isListPending,
    id: userId,
    firstName: userFirstName,
    lastName: userLastName,
    emailAddress: userEmailAddress,
    type: userType,
    token: userToken,
    language: userLanguage
  } = useSelector((state: RootState) => ({
    isLoginSuccess: state.login.isLoginSuccess,
    isPending: state.list.isPending,
    id: Number(state.user.id),
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    emailAddress: state.user.emailAddress,
    type: state.user.type,
    token: state.user.token,
    language: state.user.language
  }));

  const selected = useSelector((state: RootState) => state.page.selected);
  const dictionaryList = useSelector((state: RootState) => state.dictionary.list);

  return (
    <Account
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userId={userId}
      userFirstName={userFirstName}
      userLastName={userLastName}
      userEmailAddress={userEmailAddress}
      userType={userType}
      userToken={userToken}
      userLanguage={userLanguage}
      selected={selected}
      dictionnaryList={dictionaryList}
    />
  );
};

export default AccountContainer; 