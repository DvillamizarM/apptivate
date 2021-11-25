import * as MyTypes from "../types/types";
import { actionTypes } from "../actions/actionsDownload";

export const initialState = {
  ExerciseRoutine: [],
  ExerciseRoutineIndentifiers: [],
  GeneralInfo: [],
  GeneralInfoIds: [],
  SavedEndRoutines: [],
};

export const DownloadReducer = (
  state = initialState,
  action: MyTypes.actionsDownload
) => {
  switch (action.type) {
    case actionTypes.ADD_ITEM_TO_EXERCISE_ROUTINE:
      let previusExercises: any = state.ExerciseRoutine;
      let previusIdentifiers: any = state.ExerciseRoutineIndentifiers;

      previusExercises.push(action.payload.newExercise);
      
      previusExercises.sort(function (a, b) {
        return a.order - b.order;
      });
      previusIdentifiers.push(action.payload.title + action.payload.title2);
      console.warn("ids---", previusIdentifiers);
      return {
        ...state,
        ExerciseRoutine: previusExercises,
        ExerciseRoutineIndentifiers: previusIdentifiers,
      };

    case actionTypes.REMOVE_EXERCISE_LIST:
      let ExerciseRoutine2 = state.ExerciseRoutine;
      ExerciseRoutine2 = [];
      let ExerciseRoutineIndentifiers2 = state.ExerciseRoutineIndentifiers;
      ExerciseRoutineIndentifiers2 = [];
      return {
        ...state,
        ExerciseRoutineIndentifiers: ExerciseRoutineIndentifiers2,
        ExerciseRoutine: ExerciseRoutine2,
      };

    case actionTypes.REMOVE_EXERCISE_ITEM:
      console.warn("pyload--", action.payload);
      return {
        ...state,
        ExerciseRoutine: state.ExerciseRoutine.filter(
          (item: any) => item.order !== action.payload.order
        ),
        ExerciseRoutineIndentifiers: state.ExerciseRoutineIndentifiers.filter(
          (item: any) => item !== action.payload.title + action.payload.title2
        ),
      };

    case actionTypes.ADD_GENERAL_INFO:
      const title: String = action.payload.title;
      let content = action.payload.item;
      let tempIds: Array<String> = state.GeneralInfoIds;
      let tempInfo: any = state.GeneralInfo;
      if (tempIds.includes(title)) {
        const modIndex = tempIds.indexOf(title);
        let modInfo = tempInfo[modIndex];
        modInfo.content.push(content);
        tempInfo[modIndex] = modInfo;
      } else {
        tempIds.push(title);
        let temp = { title: title, content: [content] };
        tempInfo.push(temp);
      }
      return {
        ...state,
        GeneralInfo: tempInfo,
        GeneralInfoIds: tempIds,
      };

    case actionTypes.REMOVE_GENERAL_INFO:
      let location = action.payload;
      let tempIds1: Array<String> = state.GeneralInfoIds;
      let tempInfo1: any = state.GeneralInfo;

      if (tempInfo1[location[0]].content.length === 1) {
        tempInfo1.splice(location[0], 1);
        tempIds1.splice(location[0], 1);
      } else {
        tempInfo1[location[0]].content.splice(location[1], 1);
      }
      return {
        ...state,
        GeneralInfo: tempInfo1,
        GeneralInfoIds: tempIds1,
      };

    case actionTypes.ADD_END_ROUTINE:
      console.warn("END ROUTINE :", action.payload);
      let ended: any = state.SavedEndRoutines;
      ended.push(action.payload);
      return {
        ...state,
        SavedEndRoutines: ended,
      };

    case actionTypes.CLEAR_END_ROUTINE:
      console.warn("END ROUTINE clae :", action.payload);
      let ended1 = [];
      return {
        ...state,
        SavedEndRoutines: ended1,
      };

    default:
      return state;
  }
};

export default DownloadReducer;
