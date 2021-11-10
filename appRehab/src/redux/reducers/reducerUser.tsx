import * as MyTypes from "../types/types";
import { actionTypes } from "../actions/actionsUser";

export const initialState = {
  user: {},
  role: "",
  connection:  false,
  repoIndex: 0,
  showTour1: false,
  showTour2: false,
  showTour3: false,
  showTour4: false,
  showTour5: false,
  updateStatus: "",
};

export const UserReducer = (
  state = initialState,
  action: MyTypes.actionsUser
) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      console.warn("payload---", action.payload);
      return {
        ...state,
        user: action.payload,
      };

    case actionTypes.SET_CONNECTION:
      // console.warn("Conexion a internet :", action.payload);
      return {
        ...state,
        connection: action.payload,
      };

    case actionTypes.SET_REPOINDEX:
      // console.warn("REPO INDEX :", action.payload);
      return {
        ...state,
        repoIndex: action.payload,
      };

    case actionTypes.SHOW_TOUR1:
      console.warn("show tour 1 :", action.payload);
      return {
        ...state,
        showTour1: action.payload,
      };

    case actionTypes.SHOW_TOUR2:
      console.warn("show tour 2 :", action.payload);
      return {
        ...state,
        showTour2: action.payload,
      };
    case actionTypes.SHOW_TOUR3:
      console.warn("show tour 3 :", action.payload);
      return {
        ...state,
        showTour3: action.payload,
      };
    case actionTypes.SHOW_TOUR4:
      console.warn("show tour 4 :", action.payload);
      return {
        ...state,
        showTour4: action.payload,
      };
    case actionTypes.SHOW_TOUR5:
      console.warn("show tour 5 :", action.payload);
      return {
        ...state,
        showTour5: action.payload,
      };

    case actionTypes.UPDATE_USER_MEDICAL:
      console.warn("USER :", action.payload);

      let user2: any = state.user;
      user2.information.medical = action.payload.medical;
      user2.information.control = action.payload.control;
      console.log("++++++++-+ ------------- el valor del user es : ", user2);
      return {
        ...state,
        user: user2,
      };

    case actionTypes.UPDATE_USER_COMPANION:
      console.warn("USER :", action.payload);

      let user3: any = state.user;
      user3.companion = action.payload.companion;

      return {
        ...state,
        user: user3,
      };

    case actionTypes.UPDATE_USER_ROLE:
      console.warn("chaginging user ROLE USER :=======", action.payload);

      let user4:any = state.user;
      user4.role = action.payload.role;

      return {
        ...state,
        user: user4,
      };

    case actionTypes.UPDATE_USER_CONTROL:
      console.warn("USER :", action.payload);

      user2 = state.user;
      user2.information.control = action.payload;
      console.log("++++++++-+ ------------- el valor del user es : ", user2);
      return {
        ...state,
        user: user2,
      };

    case actionTypes.UPDATE_STATUS:
      console.log("UPDATE_STATUSUPDATE_STATUS", action.payload);
      return {
        ...state,
        updateStatus: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
