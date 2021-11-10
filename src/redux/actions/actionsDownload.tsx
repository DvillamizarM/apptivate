import { action } from "typesafe-actions";
// import ApiProducts from "../../api/ApiProducts";

export enum actionTypes {
  ADD_ITEM_TO_EXERCISE_ROUTINE = "ADD_ITEM_TO_EXERCISE_ROUTINE",
  REMOVE_EXERCISE_LIST = "REMOVE_EXERCISE_LIST",
  REMOVE_EXERCISE_ITEM = "REMOVE_EXERCISE_ITEM",
  ADD_GENERAL_INFO = "ADD_GENERAL_INFO",
  REMOVE_GENERAL_INFO = "REMOVE_GENERAL_INFO",
  ADD_END_ROUTINE = "ADD_END_ROUTINE",
  CLEAR_END_ROUTINE = "CLEAR_END_ROUTINE",
};

export const actionsDownload = {
  ADD_ITEM_TO_EXERCISE_ROUTINE: (name) => action(actionTypes.ADD_ITEM_TO_EXERCISE_ROUTINE, name),
  REMOVE_EXERCISE_LIST: (name) => action(actionTypes.REMOVE_EXERCISE_LIST, name),
  REMOVE_EXERCISE_ITEM: (name) => action(actionTypes.REMOVE_EXERCISE_ITEM, name),
  ADD_GENERAL_INFO: (name) => action(actionTypes.ADD_GENERAL_INFO, name),
  REMOVE_GENERAL_INFO: (name) => action(actionTypes.REMOVE_GENERAL_INFO, name),
  ADD_END_ROUTINE: (name) => action(actionTypes.ADD_END_ROUTINE, name),
  CLEAR_END_ROUTINE: (name) => action(actionTypes.CLEAR_END_ROUTINE, name)
};
