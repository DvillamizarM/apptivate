import React, { Component, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  Switch,
} from "react-native";
import yup from "yup";
import Picker from "../Simple/Picker";
var { vmin } = require("react-native-expo-viewport-units");

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { actionsNotifications } from "../../redux/actions/actionsNotifications";
import { ScrollView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { date } from "yup";

function realDay(dayNumber) {
  switch (dayNumber) {
    case 0:
      return "Domingo";
    case 1:
      return "Lunes";
    case 2:
      return "Martes";
    case 3:
      return "Miercoles";
    case 4:
      return "Jueves";
    case 5:
      return "Viernes";
    case 6:
      return "Sabado";
  }
}
function dayConverter(dayIndex) {
  let today = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 7) + 1
  );
  return today;
}
function timeConverter(time, ampm) {
  let splitTime = time.split(":");
  let hour = parseInt(splitTime[0]);
  const minute = parseInt(splitTime[1]);
  if (ampm == "PM") hour += 12;
  var date = new Date();
  date.setHours(hour - 1);
  date.setMinutes(minute);
  return date;
}
function scheduleDates(exerciseList) {
  let dates = [];
  exerciseList.forEach((exercise) => {
    // if(){}
    let day = exercise.weekDay;
    let time = exercise.hour;
    let ampm = exercise.ampm;
    let convertedDay = dayConverter(day);
    let convertedTime = timeConverter(time, ampm);
    let date = new Date();
    date.setFullYear(convertedDay.getFullYear());
    date.setMonth(convertedDay.getMonth());
    date.setDate(convertedDay.getDate());
    date.setHours(convertedTime.getHours());
    date.setMinutes(convertedTime.getMinutes());
    date.setSeconds(0);
    dates.push(date);
  });
  return dates;
}
const printPendingNotifications = async () => {
  await Notifications.getAllScheduledNotificationsAsync().then(
    (notifications) => {
      console.warn("Number of scheduled notifications =", notifications.length);
    }
  );
};

const ScheduleRoutines = (props) => {
  let activeDay = props.user.information.control.activeDay;
  let activeWeek = parseInt(
    props.user.information.control.activeWeek.replace(/\D/g, "")
  );
  const [validObject, setValidObject] = useState({});
  const fillValidObject = () => {
    let validAux = {};
    props.scheduledRoutines[0].exerciseList.forEach((exercise, index) => {
      if (activeDay <= index) {
        let dayId = "day" + index;
        let hourId = "hour" + index;
        let ampmId = "ampm" + index;
        validAux = {
          ...validAux,
          [dayId]: exercise.weekDay,
          [hourId]: exercise.hour,
          [ampmId]: exercise.ampm,
        };
      }
    });
    console.warn("valid----", validAux)
    return validAux;
  };
  let filledSchedule = fillValidObject();
  useEffect(() => {
    console.warn("use effect -----")
    setValidObject(filledSchedule);
    console.warn("ampmnkeffect-=---",validObject["ampm" + 3])
  }, []);
  useEffect(()=>{},[validObject])
  const toggleKeepProgramming = () => {
    const [isEnabled, setIsEnabled] = useState(
      props.scheduledRoutines[0].persist
    );
    const toggleSwitch = () => {
      const titulo = !isEnabled ? "Mantener Notifications" : "Deshabilitar";
      const message = !isEnabled
        ? "Sí acepta esta acción se van a programar todas las notificaciones de las semanas que faltan de su entrenamiento."
        : "Sí acepta esta acción se cancelan todas las notifiaciones y solo quedarán las que estan pendientes para la semana actual";
      if (
        Object.values(validObject).includes(-1) ||
        Object.values(validObject).includes("--") ||
        Object.values(validObject).includes("Seleccionar")
      ) {
        printPendingNotifications();
        console.log("alert");
        Alert.alert("Por favor seleccione todos los campos");
      } else {
        Alert.alert(
          titulo,
          message,
          [
            {
              text: "Cancelar",
            },
            {
              text: "Aceptar",
              onPress: () => {
                setIsEnabled((previousState) => !previousState);
                props.disableNotification(false);
                if (!isEnabled) {
                  props.persistNotification(true);
                  const promise = new Promise((resolve, reject) => {
                    resolve(
                      scheduleAllNotifications(
                        scheduleDates(props.scheduledRoutines[0].exerciseList)
                      )
                    );
                  });
                  promise.then(() => {
                    console.warn(" if promise then");
                    printPendingNotifications();
                  });
                } else {
                  props.persistNotification(false);
                  const validIds = 5 - activeDay;
                  let remove = props.scheduledNotifications.flat();
                  let keep = remove.splice(0, validIds);
                  const myPromise = new Promise((resolve, reject) => {
                    console.warn("remove ", remove, " keep ", keep);
                    resolve(cancelAllNotification(remove.flat()));
                  });
                  myPromise.then(() => {
                    console.warn("else promise then");
                    printPendingNotifications();
                    props.setNotificationId(keep.flat());
                  });
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    };
    return (
      <View style={KeepProgrammingStyles.container}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor="#f4f3f4" //{isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={props.scheduledRoutines[0].persist}
        />
      </View>
    );
  };

  const toggleDisableProgramming = () => {
    const [isEnabled, setIsEnabled] = useState(
      props.scheduledRoutines[0].disable
    );
    const toggleSwitch = () => {
      const titulo = !isEnabled
        ? "Deshabilitar Notifications"
        : "Reactivar Notifications";
      const message = !isEnabled
        ? "Sí acepta esta acción se van a cancelar todas las notificaciones guardadas"
        : "Sí acepta esta acción automáticamente se le programan las notificaciones pendientes de la semana";
      Alert.alert(
        titulo,
        message,
        [
          {
            text: "Cancelar",
          },
          {
            text: "Aceptar",
            onPress: () => {
              setIsEnabled((previousState) => !previousState);
              props.persistNotification(false);
              if (!isEnabled) {
                props.disableNotification(true);
                //console.warn("scheduled cancel---", props.scheduledNotifications)
                cancelAllNotification(props.scheduledNotifications.flat());
              } else {
                if (
                  Object.values(validObject).includes(-1) ||
                  Object.values(validObject).includes("--") ||
                  Object.values(validObject).includes("Seleccionar")
                ) {
                  printPendingNotifications();
                  console.log("alert");
                  Alert.alert("Por favor seleccione todos los campos");
                } else {
                  props.disableNotification(false);
                  scheduleRoutineReminder(
                    scheduleDates(props.scheduledRoutines[0].exerciseList),
                    activeWeek
                  );
                }
              }
              console.warn(
                "disable====",
                props.scheduledRoutines[0].disable,
                "///",
                isEnabled
              );
            },
          },
        ],
        { cancelable: false }
      );
    };
    return (
      <View style={KeepProgrammingStyles.container}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor="#f4f3f4" //{isEnabled ? "#767577" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={props.scheduledRoutines[0].disable}
        />
      </View>
    );
  };
  const handleLocalNotification = async () => {
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    } catch (error) {
      console.warn("handler error ---", error);
    }
  };
  const cancelAllNotification = async (ids) => {
    console.warn("cancel ids---------", ids.flat());
    try {
      //await Notifications.cancelAllScheduledNotificationsAsync();
      for await (let element of ids.flat()) {
        //console.warn("element---------- ", element);
        try {
          await Notifications.cancelScheduledNotificationAsync(element);
        } catch (error) {
          console.warn("canceleerError-----", error);
        }
      }
      props.clearNotificationIds();
      //console.warn("end cancelation");
    } catch (error) {
      console.warn("cancelationError---------", error);
    }
  };
  const scheduleRoutineReminder = async (dates, week) => {
    let scheduledRoutineNotificationId;
    let ids: any = [];
    dates = dates.flat();
    let weekAux = parseInt(week);
    //console.warn("schedule routine =======", dates);
    handleLocalNotification();
    const trigger = new Date(Date.now() + 1 * 60 * 1000);
    for await (let element of dates) {
      if (dates.indexOf(element) >= activeDay || weekAux > activeWeek) {
        try {
          scheduledRoutineNotificationId =
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "ALERTA: Rutina Pendiente",
                body: "Esta recibiendo esta notificación porque tiene una rutina programada para dentro de una hora.",
                data: { data: "goes here" },
              },
              trigger: element,
              //trigger,
            });
          ids.push(scheduledRoutineNotificationId);
        } catch (error) {
          console.warn("schedulerError-----", error);
        }
      }
    }
    console.warn("ids---------", ids);
    if (ids.length > 0) props.setNotificationId(ids.flat());
  };
  const scheduleAllNotifications = async (dates) => {
    let newDates = dates;
    let allDates: any = [];
    const nextWeek: number = parseInt("" + (activeWeek + 1));
    let active: number =
      props.scheduledNotifications.length == 0 ? activeWeek : nextWeek;
    console.warn(
      "active Week in schedule all   ++++++++",
      active,
      "length of scheduled notifs ++++",
      props.scheduledNotifications.length
    );
    if (props.scheduledNotifications.length < 2) {
      for (let i = active; i <= 10; i++) {
        newDates.forEach((element, index) => {
          let newDate = new Date();
          newDate.setDate(element.getDate() + 7);
          newDates[index] = newDate;
        });
        //console.warn("dates array----", newDates);
        allDates.push(newDates);
      }
      scheduleRoutineReminder(allDates, nextWeek);
    }
  };

  const exerciseListComponent = (exerciseList) => {
    //setValidObject({...validObject, filledSchedule})
    return exerciseList.map((exercise, index) => {
      let img = exercise.img;
      let day = exercise.day;
      let hour = "";
      let dayId = "day" + index;
      let hourId = "hour" + index;
      let ampmId = "ampm" + index;
      let active = exercise.active;
      if (activeDay <= index) {
        return (
          <View
            key={index + "e"}
            style={{
              height: vmin(45),
              width: "100%",
              marginBottom: "3%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={OverviewExerciseStyles.sectionRight}>
              <View style={pickerStyles.containerInput}>
                <Text
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Día {index+1}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "30%",
                    marginBottom:"3%",
                  }}
                >
                  <Text style={{ marginRight: "3%", width:"15%" }}>Día</Text>
                  <View style={pickerStyles.repetitionInputContainer}>
                    <Picker
                      width={"100%"}
                      height={40}
                      placeholder={"Seleccionar"}
                      setData={(itemValue, itemIndex) => {
                        props.scheduledRoutines[0].exerciseList[index].weekDay;
                        props.setWeekDay({
                          index: index,
                          weekDay: itemIndex,
                        });
                        setValidObject({
                          ...validObject,
                          [dayId]: itemIndex,
                        });
                        console.warn("picker on set====", validObject["day" + index])
                      }}
                      initialIndex = {props.scheduledRoutines[0].exerciseList[index].weekDay}
                      list={[
                        "Seleccionar",
                        "Domingo",
                        "Lunes",
                        "Martes",
                        "Miercoles",
                        "Jueves",
                        "Viernes",
                        "Sabado",
                      ]}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    width: "90%",
                    marginTop:"5%",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "30%",
                  }}
                >
                  <Text style={{ marginRight: "3%", width:"15%" }}>Hora</Text>
                  {/* <View style={pickerStyles.repetitionInputContainer}> */}
                    <Picker
                      width={"40%"}
                      height={40}
                      placeholder={"--"}
                      setData={(itemValue, itemIndex) => {
                        props.setHour({ index: index, hour: itemValue });
                        setValidObject({ ...validObject, [hourId]: itemValue });
                        console.warn("time----",props.scheduledRoutines[0].exerciseList[index])
                        //validObject["hour" + index] = itemIndex;
                      }

                      // setData({ ...data, size: itemValue })
                      }
                      initialValue= {props.scheduledRoutines[0].exerciseList[index].hour}
                      list={[
                        "--",
                        "00:00",
                        "00:30",
                        "01:00",
                        "01:30",
                        "02:00",
                        "02:30",
                        "03:00",
                        "03:30",
                        "04:00",
                        "04:30",
                        "05:00",
                        "05:30",
                        "06:00",
                        "06:30",
                        "07:00",
                        "07:30",
                        "08:00",
                        "08:30",
                        "09:00",
                        "09:30",
                        "10:00",
                        "10:30",
                        "11:00",
                        "11:30",
                        "12:00",
                        "12:30",
                      ]}
                    />
                    <Picker
                      width={"40%"}
                      height={40}
                      placeholder={"--"}
                      setData={(itemValue, itemIndex) => {
                        console.warn("setDat-----", itemValue)
                        props.setAmPm({ index: index, ampm: itemValue });
                        setValidObject({ ...validObject, [ampmId]: itemValue });
                        //validObject["ampm" + index] = itemIndex;
                      console.warn("ampmn-=---",validObject["ampm" + index])
                      // setData({ ...data, weight: itemValue })
                      }}
                      initialValue={props.scheduledRoutines[0].exerciseList[index].ampm}
                      list={["--", "AM", "PM"]}
                    />
                  {/* </View> */}
                </View>
              </View>
              
            </View>
          </View>
        );
      }
      //{setValidObject({...validObject, validAux})}
    });
  };

  return (
    <View style={styles.container}>
      {console.log("props", props)}
      <View style={styles.header}>
        <View style={{ height: "30%", width: "100%", marginBottom: "2%" }}>
          <Text
            numberOfLines={1}
            style={{ fontStyle: "italic", textAlign: "center" }}
          >
            Programar alarmas de las rutinas para la semana.
          </Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.columnContainer}>
            <Text style={styles.toggleTitle}>Desactivar programación</Text>
            {toggleDisableProgramming()}
          </View>
          <View style={styles.columnContainer}>
            <Text style={styles.toggleTitle}>Mantener programación</Text>
            {toggleKeepProgramming()}
          </View>
        </View>
      </View>

      <ScrollView style={styles.body}>
        {props.scheduledRoutines.map((week, index) => {
          console.log("-------> ", index);
          return (
            <View
              key={"id__" + index}
              style={{
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "peru",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontStyle: "italic",
                  marginTop: "2%",
                  marginBottom: "2%",
                }}
              >
                Semana {activeWeek}
              </Text>
              <View
                style={{
                  width: "95%",
                  alignItems: "center",
                  justifyContent: "center",
                  //backgroundColor: "peru",
                }}
              >
                {exerciseListComponent(week.exerciseList)}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.warn("validArray----", validObject);
            if (
              Object.values(validObject).includes(-1) ||
              Object.values(validObject).includes("--") ||
              Object.values(validObject).includes("Seleccionar")
            ) {
              printPendingNotifications();
              console.log("alert");
              Alert.alert("Por favor seleccione todos los campos");
            } else {
              cancelAllNotification(props.scheduledNotifications);
              props.disableNotification(false);
              props.persistNotification(false);
              scheduleRoutineReminder(
                scheduleDates(props.scheduledRoutines[0].exerciseList),
                activeWeek
              );
              props.navigation.navigate("ProfileScreen");
            }
          }}
        >
          <Text style={{ color: "white" }}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.warn("scheduledRoutines-----", store.NotificationReducer);
  return {
    user: store.User.user,
    activityControlNotificationId:
      store.NotificationReducer.activityControlNotificationId,
    scheduledRoutines: store.NotificationReducer.scheduledRoutines,
    scheduledNotifications: store.NotificationReducer.scheduledNotificationIds,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
  setActivityControlNotificationId: (val) =>
    dispatch(actionsNotifications.NOTIFICATION_ACTIVITY_CONTROL(val)),
  setScheduledRoutines: (val) =>
    dispatch(actionsNotifications.NOTIFICATION_SCHEDULED_ROUTINES(val)),
  setWeekDay: (val) => dispatch(actionsNotifications.UPDATE_WEEK_DAY(val)),
  setHour: (val) => dispatch(actionsNotifications.UPDATE_TIME(val)),
  setAmPm: (val) => dispatch(actionsNotifications.UPDATE_AMPM(val)),
  setNotificationId: (val) =>
    dispatch(actionsNotifications.UPDATE_NOTIFICATION_ID(val)),
  clearNotificationIds: (val) =>
    dispatch(actionsNotifications.CLEAR_NOTIFICATION_ID(val)),
  disableNotification: (val) =>
    dispatch(actionsNotifications.DISABLE_NOTIFICATIONS(val)),
  persistNotification: (val) =>
    dispatch(actionsNotifications.PERSIST_NOTIFICATIONS(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(ScheduleRoutines);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "13%",
    //height: "12%",
    //backgroundColor: "orange",
    borderColor: "rgba(21, 21, 34, 1)",
    borderBottomWidth: vmin(0.4),
    alignItems: "center",
  },

  body: {
    width: "100%",
    height: "75%",
    //backgroundColor: "peru",
  },

  footer: {
    width: "100%",
    height: "9%",
    //backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },

  rowContainer: {
    width: "100%",
    flexDirection: "row",
    //height: "70%",
    backgroundColor: "#f5f5f5",
    height: "50%",
  },

  columnContainer: {
    width: "50%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  toggleTitle: {
    fontWeight: "bold",
    //fontStyle: "italic",
    fontSize: vmin(3),
  },
});

const OverviewExerciseStyles = StyleSheet.create({
  container: {
    width: vmin(24),
    height: vmin(44),
    // backgroundColor: "yellow",
    marginRight: vmin(2),
  },

  containerTexts: {
    width: "100%",
    height: "20%",
  },

  title: {
    fontSize: vmin(3),
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: vmin(2.5),
    color: "#666666",
  },

  imageContainer: {
    overflow: "hidden",
    width: "100%",
    height: "80%",
    // backgroundColor: "green",
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },

  sectionLeft: {
    height: "100%",
    width: "30%",
  },

  sectionRight: {
    height: "100%",
    alignItems: "center",
    width: "100%",
    //   backgroundColor: "salmon",
  },
});

const pickerStyles = StyleSheet.create({
  groupPickerContainer: {
    height: "35%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: vmin(1),
    marginBottom: vmin(1),
    //backgroundColor: "green",
  },
  timeContainer: {
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 1,
    borderRadius: 5,
    height: "100%",
    textAlign: "center",
    alignItems: "center",
    paddingTop: 6,
    justifyContent: "space-around",
    // backgroundColor: "tomato",
    width: "48%",
  },
  textInput: {
    width: "100%",
    textAlign: "center",
  },
  containerInput: {
    height: "70%",
    width: "100%",
    marginLeft: "5%",
    marginRight: "5%",
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "yellow",
  },
  repetitionInputContainer: {
    height: "120%",
    width: "80%",
    borderColor: "rgba(228, 228, 228, 0.6)",
    //  borderWidth: 1,
    borderRadius: 5,
    //   backgroundColor:"blue"
  },
});

const KeepProgrammingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
