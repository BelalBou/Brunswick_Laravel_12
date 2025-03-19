import { SET_DAILY_MAIL_LIST, DailyMailAction } from "../actions/daily_mail";
import IDailyMail from "../interfaces/IDailyMail";

const initialState = {
  dailyMailList: []
};

type State = {
  dailyMailList: IDailyMail[];
};

const dailyMail = (state: State = initialState, action: DailyMailAction) => {
  switch (action.type) {
    case SET_DAILY_MAIL_LIST:
      return Object.assign({}, state, {
        dailyMailList: action.payload.data
      });
    default:
      return state;
  }
};

export default dailyMail;
