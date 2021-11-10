import { StateType, ActionType } from "typesafe-actions";
export type ReducerState = StateType<
  typeof import("../reducers/reducer").default
>;
export type actionsUser = ActionType<typeof import("../actions/actionsUser")>;
export type actionsDownload = ActionType<
  typeof import("../actions/actionsDownload")
>;
export type actionsNotifications = ActionType<
  typeof import("../actions/actionsNotifications")
>;
