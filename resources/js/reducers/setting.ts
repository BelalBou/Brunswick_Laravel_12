import { SET_SETTING_LIST, SettingAction } from "../actions/setting";
import ISetting from "../interfaces/ISetting";

const initialState = {
  settingList: []
};

type State = {
  settingList: ISetting[];
};

const setting = (state: State = initialState, action: SettingAction) => {
  switch (action.type) {
    case SET_SETTING_LIST:
      return Object.assign({}, state, {
        settingList: action.payload.data
      });
    default:
      return state;
  }
};

export default setting;
