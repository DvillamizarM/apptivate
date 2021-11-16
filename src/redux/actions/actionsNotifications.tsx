import { action } from "typesafe-actions";
// import ApiProducts from "../../api/ApiProducts";

export enum actionTypes {
  NOTIFICATION_ACTIVITY_CONTROL = "NOTIFICATION_ACTIVITY_CONTROL",
  NOTIFICATION_SCHEDULED_ROUTINES = "NOTIFICATION_SCHEDULED_ROUTINES",
  UPDATE_WEEK_DAY = "UPDATE_WEEK_DAY",
  UPDATE_TIME = "UPDATE_TIME", 
  UPDATE_AMPM = "UPDATE_AMPM",
  UPDATE_NOTIFICATION_ID = "UPDATE_NOTIFICATION_ID",
  PERSIST_NOTIFICATIONS = "PERSIST_NOTIFICATIONS",
  DISABLE_NOTIFICATIONS = "DISABLE_NOTIFICATIONS",
  CLEAR_NOTIFICATION_ID = "CLEAR_NOTIFICATION_ID"
}

export const actionsNotifications = {
  NOTIFICATION_ACTIVITY_CONTROL: (name) => action(actionTypes.NOTIFICATION_ACTIVITY_CONTROL, name),
  NOTIFICATION_SCHEDULED_ROUTINES: (value) => action(actionTypes.NOTIFICATION_SCHEDULED_ROUTINES, value),
  UPDATE_WEEK_DAY: (value) => action(actionTypes.UPDATE_WEEK_DAY, value),
  UPDATE_TIME: (value) => action(actionTypes.UPDATE_TIME, value),
  UPDATE_AMPM: (value) => action(actionTypes.UPDATE_AMPM, value),
  UPDATE_NOTIFICATION_ID: (value) => action(actionTypes.UPDATE_NOTIFICATION_ID, value),
  PERSIST_NOTIFICATIONS: (value) => action(actionTypes.PERSIST_NOTIFICATIONS, value),
  DISABLE_NOTIFICATIONS: (value) => action(actionTypes.DISABLE_NOTIFICATIONS, value),
  CLEAR_NOTIFICATION_ID: (value) => action(actionTypes.CLEAR_NOTIFICATION_ID, value), 
};