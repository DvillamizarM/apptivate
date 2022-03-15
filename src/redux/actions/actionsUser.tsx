import { action } from "typesafe-actions";
// import ApiProducts from "../../api/ApiProducts";

export enum actionTypes {
  SET_USER = "SET_USER",
  SET_CONNECTION = "SET_CONNECTION",
  SET_REPOINDEX = "SET_REPOINDEX",
  SET_REPOLEVEL = " SET_REPOLEVEL",
  SHOW_TOUR1 = "SHOW_TOUR1",
  SHOW_TOUR2 = "SHOW_TOUR2",
  SHOW_TOUR3 = "SHOW_TOUR3",
  SHOW_TOUR4 = "SHOW_TOUR4",
  SHOW_TOUR5 = "SHOW_TOUR5",
  UPDATE_USER_MEDICAL = "UPDATE_USER_MEDICAL",
  UPDATE_USER_COMPANION = "UPDATE_USER_COMPANION",
  UPDATE_USER_ROLE = "UPDATE_USER_ROLE",
  UPDATE_USER_CONFIGURATION = "UPDATE_USER_CONFIGURATION",
  UPDATE_USER_CONTROL = "UPDATE_USER_CONTROL",
  UPDATE_STATUS = "UPDATE_STATUS",
  UPDATE_PERCEIVED_FORCE= "UPDATE_PERCEIVED_FORCE",
  // SET_PERSONAL
}

export const actionsUser = {
  SET_USER: (name) => action(actionTypes.SET_USER, name),
  SET_CONNECTION: (value) => action(actionTypes.SET_CONNECTION, value),
  SET_REPOINDEX: (value) => action(actionTypes.SET_REPOINDEX, value),
  SET_REPOLEVEL: (value) => action(actionTypes.SET_REPOLEVEL, value),
  SHOW_TOUR1: (value) => action(actionTypes.SHOW_TOUR1, value),
  SHOW_TOUR2: (value) => action(actionTypes.SHOW_TOUR2, value),
  SHOW_TOUR3: (value) => action(actionTypes.SHOW_TOUR3, value),
  SHOW_TOUR4: (value) => action(actionTypes.SHOW_TOUR4, value),
  SHOW_TOUR5: (value) => action(actionTypes.SHOW_TOUR5, value),
  UPDATE_PERCEIVED_FORCE:  (value) => action(actionTypes.UPDATE_PERCEIVED_FORCE, value),
  UPDATE_USER_MEDICAL: (value) =>
    action(actionTypes.UPDATE_USER_MEDICAL, value),
  UPDATE_USER_COMPANION: (value) =>
    action(actionTypes.UPDATE_USER_COMPANION, value),
  UPDATE_USER_ROLE: (value) => action(actionTypes.UPDATE_USER_ROLE, value),
  UPDATE_USER_CONFIGURATION: (value) => action(actionTypes.UPDATE_USER_CONFIGURATION, value),
  UPDATE_USER_CONTROL: (value) =>
    action(actionTypes.UPDATE_USER_CONTROL, value),
  UPDATE_STATUS: (value) => action(actionTypes.UPDATE_STATUS, value),
};
