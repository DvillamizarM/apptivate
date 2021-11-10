import { combineReducers } from "redux";
import reducerUser from "./reducerUser";
import DownloadReducer from "./reducerDownload";
import NotificationReducer from "./reducerNotifications"

const rootReducer = combineReducers({
  User: reducerUser,
  DownloadReducer: DownloadReducer,
  NotificationReducer: NotificationReducer,
});

export default rootReducer;
