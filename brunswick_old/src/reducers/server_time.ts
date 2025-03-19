import { SET_SERVER_TIME_LIST, ServerTimeAction } from "../actions/server_time";

const initialState = {
  serverTimeList: ''
};

type State = {
  serverTimeList: string;
};

const serverTime = (state: State = initialState, action: ServerTimeAction) => {
  switch (action.type) {
    case SET_SERVER_TIME_LIST:
      return Object.assign({}, state, {
        serverTimeList: action.payload.data
      });
    default:
      return state;
  }
};

export default serverTime;
