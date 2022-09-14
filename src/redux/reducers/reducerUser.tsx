import * as MyTypes from "../types/types";
import { actionTypes } from "../actions/actionsUser";

export const initialState = {
  user: {},
  role: "",
  connection:  false,
  repoIndex: 0,
  repoLevel: "preprotesico",
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
      return {
        ...state,
        user: action.payload,
      };

    case actionTypes.SET_CONNECTION:
      return {
        ...state,
        connection: action.payload,
      };

    case actionTypes.SET_REPOINDEX:
      return {
        ...state,
        repoIndex: action.payload,
      };

      case actionTypes.SET_REPOLEVEL:
        return {
          ...state,
          repoLevel: action.payload,
        };

    case actionTypes.SHOW_TOUR1:
      return {
        ...state,
        showTour1: action.payload,
      };

    case actionTypes.SHOW_TOUR2:
      return {
        ...state,
        showTour2: action.payload,
      };
    case actionTypes.SHOW_TOUR3:
      return {
        ...state,
        showTour3: action.payload,
      };
    case actionTypes.SHOW_TOUR4:
      return {
        ...state,
        showTour4: action.payload,
      };
    case actionTypes.SHOW_TOUR5:
      return {
        ...state,
        showTour5: action.payload,
      };

    case actionTypes.UPDATE_USER_MEDICAL:

      let user2: any = state.user;
      user2.information.medical = action.payload.medical;
      user2.information.control = action.payload.control;
      return {
        ...state,
        user: user2,
      };

    case actionTypes.UPDATE_USER_COMPANION:

      let user3: any = state.user;
      user3.companion = action.payload.companion;

      return {
        ...state,
        user: user3,
      };

    case actionTypes.UPDATE_USER_ROLE:

      let user4:any = state.user;
      user4.role = action.payload.role;

      return {
        ...state,
        user: user4,
      };

      case actionTypes.UPDATE_USER_CONFIGURATION:
        
        let user5:any = state.user;
        user5.configuration = action.payload;
        
        return {
          ...state,
          user: user5,
        };
        
      case actionTypes.UPDATE_PERCEIVED_FORCE:
        
        let user6:any = state.user;
        user6.information.medical.perceivedForce = action.payload;
        
        return {
          ...state,
          user: user6,
        };

    case actionTypes.UPDATE_USER_CONTROL:

      user2 = state.user;
      user2.information.control = action.payload;
      return {
        ...state,
        user: user2,
      };

    case actionTypes.UPDATE_STATUS:
      return {
        ...state,
        updateStatus: action.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
