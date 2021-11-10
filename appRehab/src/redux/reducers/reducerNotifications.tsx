import * as MyTypes from "../types/types";
import { actionTypes } from "../actions/actionsNotifications";


const scheduledRoutines = [
  {
    title: "Semana",
    persist: false,
    disable: false,
    exerciseList: [
      {
        img: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/ESTIRAMIENTO%20FRONTAL(warmup).gif?alt=media&token=1b6c8bff-ca0f-4625-912f-7553751d3c96",
        subtitle: "",
        day: "Día 1",
        hour: "07:00",
        ampm: "PM",
        weekDay: 1,
      },

      {
        img: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/ESTIRAMIENTO%20FRONTAL(warmup).gif?alt=media&token=1b6c8bff-ca0f-4625-912f-7553751d3c96",
        subtitle: "",
        day: "Día 2",
        hour: "07:00",
        ampm: "PM",
        weekDay: 2,
      },

      {
        img: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/ESTIRAMIENTO%20FRONTAL(warmup).gif?alt=media&token=1b6c8bff-ca0f-4625-912f-7553751d3c96",
        subtitle: "",
        day: "Día 3",
        hour: "07:00",
        ampm: "PM",
        weekDay: 3,
      },

      {
        img: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/ESTIRAMIENTO%20FRONTAL(warmup).gif?alt=media&token=1b6c8bff-ca0f-4625-912f-7553751d3c96",
        subtitle: "",
        day: "Día 4",
        hour: "07:00",
        ampm: "PM",
        weekDay: 4,
      },

      {
        img: "https://firebasestorage.googleapis.com/v0/b/rehabilitacion-420dc.appspot.com/o/ESTIRAMIENTO%20FRONTAL(warmup).gif?alt=media&token=1b6c8bff-ca0f-4625-912f-7553751d3c96",
        day: "Día 5",
        subtitle: "",
        hour: "07:00",
        ampm: "PM",
        weekDay: 5,
      },
    ],
  },
];

export const initialState = {
  activityControlNotificationId: "",
  scheduledRoutines,
  scheduledNotificationIds: []
};

export const NotificationReducer = (
  state = initialState,
  action: MyTypes.actionsNotifications
) => {
  switch (action.type) {
    case actionTypes.NOTIFICATION_ACTIVITY_CONTROL:
      return {
        ...state,
        activityControlNotificationId: action.payload,
      };

      case actionTypes.NOTIFICATION_SCHEDULED_ROUTINES:
      return {
        ...state,
        scheduledRoutines: action.payload,
      };
      
    case actionTypes.UPDATE_WEEK_DAY:
      let scheduledRoutines2 = state.scheduledRoutines;
      scheduledRoutines2[0].exerciseList[action.payload.index].weekDay = action.payload.weekDay;
      return {
        ...state,
        scheduledRoutines: scheduledRoutines2,
      };
            
    case actionTypes.UPDATE_TIME:
      scheduledRoutines2 = state.scheduledRoutines;
      scheduledRoutines2[0].exerciseList[action.payload.index].hour = action.payload.hour;
      return {
        ...state,
        scheduledRoutines: scheduledRoutines2,
      };
     
    case actionTypes.UPDATE_AMPM:
      scheduledRoutines2 = state.scheduledRoutines;
      scheduledRoutines2[0].exerciseList[action.payload.index].ampm = action.payload.ampm;
      return {
        ...state,
        scheduledRoutines: scheduledRoutines2,
      };  

      case actionTypes.UPDATE_NOTIFICATION_ID:
        console.warn("update notifications =", action.payload)
        if(action.payload.length!=0){
          return {
          ...state,
          scheduledNotificationIds: [...state.scheduledNotificationIds, action.payload]
        };
        }
        
        case actionTypes.CLEAR_NOTIFICATION_ID:
          console.warn("clear notifications ")
          return {
            ...state,
            scheduledNotificationIds: []
          };
         
      case actionTypes.PERSIST_NOTIFICATIONS:
        console.warn("persist notifications payload=", action.payload)
        scheduledRoutines2 = state.scheduledRoutines;
        scheduledRoutines2[0].persist = action.payload;
        return {
          ...state,
          scheduledRoutines: scheduledRoutines2,
        };
        
      case actionTypes.DISABLE_NOTIFICATIONS:
        console.warn("disable notifications payload=", action.payload)
        scheduledRoutines2 = state.scheduledRoutines;
        scheduledRoutines2[0].disable = action.payload;

        return {
          ...state,
          scheduledRoutines: scheduledRoutines2,
        };
      
    default:
      return state;
  }
};

export default NotificationReducer;
