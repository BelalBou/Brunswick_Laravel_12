import { SET_ALLERGY_LIST, AllergyAction } from "../actions/allergy";
import IAllergy from "../interfaces/IAllergy";

const initialState = {
  allergyList: []
};

type State = {
  allergyList: IAllergy[];
};

const allergy = (state: State = initialState, action: AllergyAction) => {
  switch (action.type) {
    case SET_ALLERGY_LIST:
      return Object.assign({}, state, {
        allergyList: action.payload.data
      });
    default:
      return state;
  }
};

export default allergy;
