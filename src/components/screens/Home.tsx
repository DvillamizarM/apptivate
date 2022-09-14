import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import firebase from "../../../database/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as FileSystem from "expo-file-system";
var { vmin } = require("react-native-expo-viewport-units");
import Login from "./Login";
import NavigateNext from "react-native-vector-icons/MaterialIcons";
import BookOutline from "react-native-vector-icons/Ionicons";
import Dumbbell from "react-native-vector-icons/MaterialCommunityIcons";
import User_o from "react-native-vector-icons/FontAwesome";
import CompanionHome from "../companion/CompanionHome";
import HomePhysiotherapist from "../Physiotherapist/HomePhysiotherapist";
import AdministratorHome from "../Administrator/AdministratorHome";
import { actionsDownload } from "../../redux/actions/actionsDownload";
import ChargeScreen from "../Simple/ChargeScreen";

interface Props {
  setConnection: (value: any) => any;
  connection: any;
  setUser: (value: any) => any;
  user: any;
  activityControlNotificationId: any;
}

class HomeScreen extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    appState: AppState.currentState,
    connection: false,
    publicUser: null,
    loading: true,
    mounted: true,
    unsubscribe: () => {},
  };
  checkNetInfo = () => {
    NetInfo.fetch().then((state) => {
      this.props.setConnection(state.isConnected);
      this.setState({ connection: state.isConnected });
    });
  };
  registerForPushNotificationsAsync = async () => {
    try {
      let token;
      if (Constants.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          Alert.alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        //Alert.alert(token);
        this.setState({ expoPushToken: token });
      } else {
        Alert.alert("Must use physical device for Push Notifications");
      }
      const res = await firebase.db
        .collection("users")
        .doc(firebase.auth.currentUser?.uid)
        .set({ token }, { merge: true });

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error) {
    }
  };
  async sendPushNotification(token) {
    const message = {
      to: token,
      sound: "default",
      title: "Cambio de Usuario",
      body: "Ha sido vinculado a una entidad. Por favor ingrese a la app para finalizar su registro",
      data: { someData: "goes here" },
    };
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }
  async sendStatusUpdateNotification() {
    const users = await firebase.db
      .collection("users")
      .where("role", "==", "paciente")
      .where("companionEmail", "==", "")
      .get();
    users.docs.map((user) => this.sendPushNotification(user.data().token));
  }
  checkAsync() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores?.map((result, i, store) => {
          return true;
        });
      });
    });
  }
  clearAllData() {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => this.props.navigation.navigate("Login"));
  }

  removeInvasiveCache = async () => {
    let dir: String[] = [];

    try {
      dir = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory + "cache"
      );

      dir &&
        dir.length > 0 &&
        (await FileSystem.deleteAsync(FileSystem.documentDirectory + "cache/"));
    } catch {
      (err) => console.log("no cached");
    }
  };

  componentDidMount = () => {
    try {
      this.removeInvasiveCache();
      this.props.setRepoLevel("preprotesico")
      //para sincronizar las finalziaciones de rutina en almacenamiento local por falta de conexion internet
      if (!this.props.cachedEndRoutines.empty) {
        this.syncCachedEndRoutines(this.props.cachedEndRoutines);
      }

      this.checkNetInfo();
      // if (this.state.mounted) {
      const temp = new Promise((resolve) => {
        resolve(firebase.auth.onAuthStateChanged(this.onAuthStateChanged));
      });
      temp.then(() => {

        this.setState({ loading: false });
      });
      // }
    } catch (error) {
      console.warn("Home Error ---", error);
    }
  };

  onAuthStateChanged = async (user) => {
    let user2 = {};
    if (user && user.email !== "") {
      // Si el usuario tiene una sesion activa se trae su informacion de la base de datos
      if (this.props.connection) {
        await firebase.db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((user_db) => {
            let data: any = user_db.data();
            user2["uid"] = user.uid;
            user2["email"] = user.email;
            user2["information"] = data;
        
            this.props.setUser(user2);
            const r = JSON.stringify(user2["information"]);
            if (user2.information.token === "") {
              this.registerForPushNotificationsAsync();
            }
          })
          .catch((e) => {
            console.log("El error es ", e);
          });
      }
    }
  };

  syncCachedEndRoutines = async (list) => {
    let idRecord = "";
    list.forEach(async (form, index) => {
      let res = await firebase.db.collection("endRoutine").add({
        ...form,
        day: this.props.user.information.control.activeDay,
        week: this.props.user.information.control.activeWeek,
        reportTime: new Date().getTime(),
        uid: this.props.user.uid,
      });
      idRecord = res.id;
      if (form.endRoutine === "Si") {
        await this.updateControl(idRecord, form);
      }
      if (index === list.length - 1) {
        await firebase.db
          .collection("users")
          .doc(this.props.user.uid)
          .update({
            ["medical.perceivedForce"]: form.percivedEffort,
          });
        this.props.clearCachedEndRoutines(0);
      }
    });
  };

  updateControl = async (idRecord, form) => {
    let trainingPhase = this.props.user.information.control.trainingPhase;
    let activeWeek = this.props.user.information.control.activeWeek;
    let activeDay = this.props.user.information.control.activeDay;
    let old_record = this.props.user.information.control.record || [];
    let new_trainingPhase = "";
    let new_activeWeek = "";
    let new_activeDay = 0;
    if (form.endRoutine == "Si") {
      if (activeDay + 1 == 5) {
        new_activeDay = 0;
        new_activeWeek =
          "week" + (parseInt(activeWeek.replace("week", ""), 10) - -1);

        if (new_activeWeek == "week11") {
          const list = await this.sendCompletion();
          new_trainingPhase = "Finalizada";
        } else if (parseInt(new_activeWeek.replace("week", ""), 10) <= 3) {
          new_trainingPhase = "Inicial";
        } else if (parseInt(new_activeWeek.replace("week", ""), 10) <= 7) {
          new_trainingPhase = "Intermedia";
        } else {
          new_trainingPhase = "Avanzada";
        }
      } else {
        new_activeDay = activeDay + 1;
        new_trainingPhase = trainingPhase;
        new_activeWeek = activeWeek;
      }

      const aux = old_record.push(idRecord);

      await firebase.db
        .collection("users")
        .doc(this.props.user.uid)
        .update({
          control: {
            trainingPhase: new_trainingPhase,
            activeDay: new_activeDay,
            activeWeek: new_activeWeek,
            record: old_record,
          },
        })
        .then((e) => {
          this.props.updateUserControl({
            trainingPhase: new_trainingPhase,
            activeDay: new_activeDay,
            activeWeek: new_activeWeek,
            record: old_record,
          });
        });

      // Cuando se termina la semana 10 el contador aumneta y queda "week11" esto siginifica que acabo el protocolo
      if (new_activeWeek == "week11") {
        this.props.navigation.navigate("SatisfactionSurvey");
      }
    }
  };

  sendCompletion = async () => {
    await firebase.db
      .collection("users")
      .where("personal.email", "in", [
        this.props.user.information.companionEmail,
        this.props.user.information.physioEmail,
      ])
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.sendPushNotificationEnd(doc.data().token);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  sendPushNotificationEnd = async (expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Rutina Finalizada!" + this.props.user.information.personal.name,
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  logOut = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Está seguro que quiere cerrar sesión? ",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Cerrar Sesión",
          onPress: async () => {
            await firebase.auth.signOut().then(() => {
              AsyncStorage.getAllKeys()
                .then((keys) => AsyncStorage.multiRemove(keys))
                .then(() => this.props.navigation.navigate("Login"));
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  userBody = () => {
    return (
      <View style={{ width: "100%", height: "100%", flexDirection: "column" }}>
        {/* <TourGuideZone
            zone={1}
            text="La información esta organizada por categoría. Con las flechas de los lados se puede mover por las categorías."
            borderRadius={16}
          > */}
        <TouchableOpacity
          style={styles.groupContainerBlue}
          onPress={() => {
            this.props.navigation.navigate("Repository");
          }}
        >
          <View style={styles.containerIcon}>
            <BookOutline name="book-outline" size={vmin(13)} />
          </View>

          <View style={styles.containerText}>
            <Text style={styles.tile1}>Catálogo de Información</Text>
            <Text style={styles.tile2}>
              Consultar colección de información general, planes y restricciones
            </Text>
          </View>

          <View style={styles.arrowContainer}>
            <NavigateNext name="navigate-next" size={vmin(10)} />
          </View>
        </TouchableOpacity>
        {/* </TourGuideZone> */}
        {this.props.user.information.medical === undefined ? (
          <View></View>
        ) : (
          <TouchableOpacity
            style={styles.groupContainerOrange}
            onPress={() => {
              AsyncStorage.getItem("persist:root", (err, result) => {
              });
              //  <GeneralProfileScreen props={props} />
              this.props.navigation.navigate("ProfileScreen", {
                name: this.props.user.information.personal.name,
              });
            }}
          >
            <View style={styles.containerIcon}>
              <Dumbbell name="dumbbell" size={vmin(13)} />
            </View>

            <View style={styles.containerText}>
              <Text style={styles.tile1}>Plan de Ejercicios</Text>
              <Text style={styles.tile2}>
                Consultar proceso personal del plan de ejercicios
              </Text>
            </View>

            <View style={styles.arrowContainer}>
              <NavigateNext name="navigate-next" size={vmin(10)} />
            </View>
          </TouchableOpacity>
        )}

      </View>
    );
  };

  patientRegisterBody = () => {
    return (
      <TouchableOpacity
        style={[
          styles.greenGroupContainer,
          {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={() => this.props.navigation.navigate("RegisterPatient")}
      >
        <View style={styles.containerIcon}>
          <User_o name="user-o" size={vmin(10)} />
        </View>
        <View style={[styles.containerText, { alignItems: "center" }]}>
          <Text style={styles.tile1}>Continuar Registro</Text>
          <Text style={[styles.tile2, { width: "85%" }]}>
            Usted ha sido identificado como usuario vinculado a una entidad. Por
            favor dar clic aquí para terminar su registro y acceder a la app.
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <NavigateNext name="navigate-next" size={vmin(7)} />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{
            backgroundColor: "#ffffff",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <ChargeScreen />
        </View>
      );
    } else if (
      typeof this.props.user.information == "undefined" ||
      typeof this.props.user.information.personal.name == "undefined"
    ) {
      return <Login navigation={this.props.navigation} />;
    } else if (
      // false &&
      this.props.user.information &&
      this.props.user.information.personal &&
      this.props.user.information.personal.name &&
      this.props.user.information.role === ""
    ) {
      return (
        <View style={styles.container}>
          <View style={styles.body}>{this.userBody()}</View>
          <View style={styles.footer}>
            {this.props.connection && (
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  //this.clearAllData()
                  const check =
                    this.props.user.information.medical === undefined
                      ? true
                      : false;
                  this.props.navigation.navigate("UpdateInfo", {
                    check: { check },
                  });
                  //this.checkAsync();
                  // this.logOut();

                  //   await this.addData();
                }}
              >
                <Text style={{ color: "white" }}>Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    } else if (
      // false &&
      this.props.user.information &&
      this.props.user.information.personal &&
      this.props.user.information.personal.name &&
      this.props.user.information.role == "administrator"
    ) {
      return <AdministratorHome navigation={this.props.navigation} />;
    } else if (
      // false &&
      this.props.user.information &&
      this.props.user.information.personal &&
      this.props.user.information.personal.name &&
      this.props.user.information.role == "physiotherapist"
    ) {
      return <HomePhysiotherapist navigation={this.props.navigation} />;
    } else if (
      // false &&
      this.props.user.information &&
      this.props.user.information.personal &&
      this.props.user.information.personal.name &&
      this.props.user.information.role == "companion"
    ) {
      return <CompanionHome navigation={this.props.navigation} />;
    } else if (
      // false &&
      this.props.user.information &&
      this.props.user.information.personal &&
      this.props.user.information.personal.name
    ) {
      return (
        <View style={styles.container}>
          <View style={styles.body}>
            {this.props.user.information &&
            this.props.user.information.role === "paciente" &&
            this.props.user.information.medical &&
            this.props.user.information.companionEmail === ""
              ? this.patientRegisterBody()
              : this.userBody()}
          </View>

          <View style={styles.footer}>
            {this.props.connection && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  //  this.clearAllData()
                  this.props.navigation.navigate("UpdatePatient");
                  //this.checkAsync();
                  // this.logOut();
                }}
              >
                <Text style={{ color: "white" }}>Editar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    } else if (false) {
      return <Text>No existen campos</Text>;
    } else {
      return (
        <View
          style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
          <ScrollView
            style={{
              flex: 1,
            }}
          >
            <StatusBar
              barStyle="light-content"
              backgroundColor={this.props.connection ? "blue" : "red"}
            />
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("EndRoutine", {
                  routineIsNotOver: false,
                })
              }
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>End Routine</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ScheduleRoutines")}
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>ScheduleRoutines</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Login")}
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ReportEvent")}
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>ReportEvent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("HomePhysiotherapist")
              }
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>HomePhysiotherapist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("SatisfactionSurvey")
              }
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>SatisfactionSurvey</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("RecordTrainingData")
              }
              style={{
                backgroundColor: "orange",
                height: 50,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>RecordTrainingData</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    connection: store.User.connection,
    repoIndex: store.User.repoIndex,
    user: store.User.user,
    activityControlNotificationId: store.User.activityControlNotificationId,
    ExerciseRoutine: store.DownloadReducer.ExerciseRoutine,
    cachedEndRoutines: store.DownloadReducer.SavedEndRoutines,
    updateStatus: store.User.updateStatus,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setConnection: (value) => dispatch(actionsUser.SET_CONNECTION(value)),
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
  setRepoLevel: (val) => dispatch(actionsUser.SET_REPOLEVEL(val)),
  updateUserControl: (data) => dispatch(actionsUser.UPDATE_USER_CONTROL(data)),
  clearCachedEndRoutines: (data) =>
    dispatch(actionsDownload.CLEAR_END_ROUTINE(data)),
});
export default connect(MapStateToProps, MapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: { backgroundColor: "white", width: "100%", height: "100%" },
  header: {
    height: "10%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
    borderBottomColor: "rgba(21, 21, 34, 1)",
    borderBottomWidth: 1,
  },
  textHeader: {
    fontSize: vmin(4),
    fontStyle: "italic",
    backgroundColor: "#f5f5f5",
    width: "100%",
    textAlign: "center",
    marginTop: "2%",
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: "60%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    margin: "5%",
  },

  body: {
    height: "90%",
    width: "100%",
    // backgroundColor:"gren"
  },

  greenGroupContainer: {
    width: "100%",
    height: "50%",
    marginTop: "2%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(21, 21, 34, 1)",
    backgroundColor: "rgba(174, 255, 145, 1)",
  },

  containerIcon: {
    width: "25%",
    // backgroundColor:"gray",
    marginTop: "3%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center",
  },
  groupContainerOrange: {
    width: "100%",
    height: "50%",
    marginTop: "2%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    //  borderBottomWidth: 1,
    backgroundColor: "rgba(225, 126, 62,0.6)",
    // backgroundColor:"rgba(251, 224, 168,0.5)",
    //backgroundColor: "rgba(250, 234, 5, 0.5)",
    //  borderBottomColor: "rgba(21, 21, 34, 1)",
  },
  groupContainerBlue: {
    width: "100%",
    height: "50%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //borderBottomWidth: 1,
    backgroundColor: "rgba(105,121,248,0.5)",
    //   borderBottomColor: "rgba(21, 21, 34, 1)",
  },
  containerText: {
    width: "100%",
    // backgroundColor:"yellow",
    height: "40%",
    justifyContent: "center",
  },

  tile1: {
    fontSize: vmin(6),
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
    marginBottom: vmin(1),
  },

  tile2: {
    fontSize: vmin(4),
    color: "#000000",
    textAlign: "center",
    // color: "background: rgba(153, 153, 153, 1)",
  },

  arrowContainer: {
    width: "10%",
    //backgroundColor:"salmon",
    height: "20%",
    justifyContent: "center",
  },

  footer: {
    height: "10%",
    width: "100%",
    // backgroundColor:"peru"
  },
});

// addData = async () => {
//   var batch = firebase.db.batch();
//   let array = {
//     warmup: {
//       order: "1",
//       refs: [
//         firebase.db.doc("/exercise/0NSxMIlwexBN40kxPadW"),
//         firebase.db.doc("/exercise/16DSqoWbiWIAhZ3G7NHw"),
//         firebase.db.doc("/exercise/aEQYOic4VGCnhBsWpquM"),
//         firebase.db.doc("/exercise/tdb41Bg2p12viwjSIJ1h"),
//       ],
//       phase: "",
//       setup: {
//         repeticiones: 10,
//         series: 5,
//       },
//       title: "Calentamiento",
//     },
//     stretch: {
//       order: "2",
//       refs: [
//         firebase.db.doc("/exercise/KsIRW4YfHCeppAIys4M9"),
//         firebase.db.doc("/exercise/LPT8jGVHuGxd7IimRhp5"),
//         firebase.db.doc("/exercise/lrDS1C51PCNE0gNkYzlY"),
//         firebase.db.doc("/exercise/Rz2PiE58dUoH3ToqbwQu"),
//       ],
//       phase: "",
//       setup: {
//         repeticiones: 10,
//         series: 5,
//       },
//       title: "Estiramiento",
//     },
//     cooldown: {
//       order: "13",
//       refs: [
//         firebase.db.doc("/exercise/EbWF2tghBEkWWuo1gc8l"),
//         firebase.db.doc("/exercise/J2Hnpx2hiIleeg0z2Pk3"),
//         firebase.db.doc("/exercise/PQIkA58imgH9HazAQXJ6"),
//       ],
//       phase: "",
//       setup: {
//         repeticiones: 10,
//         series: 5,
//       },
//       title: "Enfriamiento",
//     },
//     week1: {
//       order: "4",
//       refs: [
//         firebase.db.doc("/exercise/RgeKISkF7V8O4iUXrQNh"),
//         firebase.db.doc("/exercise/tdnRw12ZSSgqz1neN9FG"),
//         firebase.db.doc("/exercise/wsRMdaeg2ZxmGWEJvbxl"),
//         firebase.db.doc("/exercise/c4Ilw3l8xnspQSomuURm"),
//         firebase.db.doc("/exercise/xLmjc1uY1sIPZ9tXtV0l"),
//         firebase.db.doc("/exercise/srLaM2udfUPDmKM2RxZo"),
//         firebase.db.doc("/exercise/GUYQdp7VxlyLzZ7PMKiO"),
//         firebase.db.doc("/exercise/nTPMN9TYCwVQeUANi3tb"),
//         firebase.db.doc("/exercise/RtI2i5F7qT9uGmYVD22j")
//       ],
//       phase: "Inicial",
//       setup: {
//         repeticiones: 10,
//         series: 2,
//       },
//       title: "Semana 1",
//     },
//     week2: {
//       order: "5",
//       refs: [
//         firebase.db.doc("/exercise/hqUMUDIOHrmuOqcfrkrb"),
//         firebase.db.doc("/exercise/Eh2pgt5Hxnu4gtMoDZhy"),
//         firebase.db.doc("/exercise/7VAJqZJDhwuigAyVD31O"),
//         firebase.db.doc("/exercise/lE6E2USURZi4vCbhfTtq"),
//         firebase.db.doc("/exercise/g1bm6d1da0W71xrP3fXu"),
//         firebase.db.doc("/exercise/Hkamr5L6WEZ41ohaXzvd"),
//         firebase.db.doc("/exercise/jExGwIBoHEbKE8T8htQm"),
//         firebase.db.doc("/exercise/hCuGf3J2uEp6igBV4B9T"),
//         firebase.db.doc("/exercise/8DE9scpjwUPFcwnqr8GP"),
//         firebase.db.doc("/exercise/oRhVThq32NJ2Aj1SXhAD"),
//       ],
//       phase: "Inicial",
//       setup: {
//         repeticiones: 10,
//         series: 4,
//       },
//       title: "Semana 2",
//     },
//     week3: {
//       order: "6",
//       refs: [
//         firebase.db.doc("/exercise/Pi9PdHOACI05wzGQr2ug"),
//         firebase.db.doc("/exercise/eBwu9sDj2c3sKr1RfUAh"),
//         firebase.db.doc("/exercise/dGriEyLXjLjH2R7wIukE"),
//         firebase.db.doc("/exercise/vmAyuFTswxkEg3aSwmr0"),
//         firebase.db.doc("/exercise/EzsHbO23Pf3wFuKYnh9r"),
//         firebase.db.doc("/exercise/VBhwlZSIOkshoRmfDfmt"),
//         firebase.db.doc("/exercise/noIXpOt2AiduYtOINCe9"),
//         firebase.db.doc("/exercise/6KEU1u127n61HLXL1new"),
//         firebase.db.doc("/exercise/xROgvDg29tateC3PM4uq"),
//         firebase.db.doc("/exercise/3HAmDnIWlIqRFiXXhWo4"),
//       ],
//       phase: "Inicial",
//       setup: {
//         repeticiones: 10,
//         series: 5,
//       },
//       title: "Semana 3",
//     },
//     week4: {
//       order: "7",
//       refs: [
//         firebase.db.doc("/exercise/gZ4p5DhWoKYkrrNC8cPQ "),
//         firebase.db.doc("/exercise/bhLn72bBAr63G3TjcDxq"),
//         firebase.db.doc("/exercise/8F9b5CLVPY5GiZz2X8GS"),
//         firebase.db.doc("/exercise/ljUkzvWcUBvWXu6PaUUn"),
//         firebase.db.doc("/exercise/dhb6rrAX1jFnLi5nAhLG"),
//         firebase.db.doc("/exercise/w1lW97wQyWmRd0oXnRIo"),
//         firebase.db.doc("/exercise/RD4QFrzro7VwDCUO6lgq"),
//         firebase.db.doc("/exercise/MapG4cC5kaODCRrtoDdR"),
//         firebase.db.doc("/exercise/rSdN4VaEXoBPZaPBMuPa")
//       ],
//       phase: "Intermedia",
//       setup: {
//         repeticiones: 10,
//         series: 5,
//       },
//     },
//     week5: {
//       order: "8",
//       refs: [
//         firebase.db.doc("/exercise/bZTkpEdoc9UuQjKqnpW4"),
//         firebase.db.doc("/exercise/cb00ScTwA4OEdMZq4Wzv"),
//         firebase.db.doc("/exercise/xXbRCQ0kHQk92WpDer0C"),
//         firebase.db.doc("/exercise/qayvX9W9fs2BBtbCCKAd"),
//         firebase.db.doc("/exercise/AvCpZctjIdqXWouVHsmM"),
//         firebase.db.doc("/exercise/MR8xRIH4befPjjc5PsS4"),
//         firebase.db.doc("/exercise/ZDLzGQ33CMSgaDq1103f"),
//         firebase.db.doc("/exercise/KceisEseBKlrvGNhFELF"),
//         firebase.db.doc("/exercise/QhaGgIlCOiFqUAFtY62k"),
//         firebase.db.doc("/exercise/ltkqHtpQsO6bZE6M4Y5A"),
//       ],
//       phase: "Intermedia",
//       setup: {
//         repeticiones: 15,
//         series: 4,
//       },
//       title: "Semana 5",
//     },
//     week6: {
//       order: "9",
//       refs: [
//         firebase.db.doc("/exercise/RgeKISkF7V8O4iUXrQNh"),
//         firebase.db.doc("/exercise/tdnRw12ZSSgqz1neN9FG"),
//         firebase.db.doc("/exercise/wsRMdaeg2ZxmGWEJvbxl"),
//         firebase.db.doc("/exercise/c4Ilw3l8xnspQSomuURm"),
//         firebase.db.doc("/exercise/xLmjc1uY1sIPZ9tXtV0l"),
//         firebase.db.doc("/exercise/srLaM2udfUPDmKM2RxZo"),
//         firebase.db.doc("/exercise/GUYQdp7VxlyLzZ7PMKiO"),
//         firebase.db.doc("/exercise/nTPMN9TYCwVQeUANi3tb"),
//         firebase.db.doc("/exercise/RtI2i5F7qT9uGmYVD22j")
//       ],
//       phase: "Intermedia",
//       setup: {
//         repeticiones: 15,
//         series: 5,
//       },
//       title: "Semana 6",
//     },
//     week7: {
//       order: "10",
//       refs: [
//         firebase.db.doc("/exercise/hqUMUDIOHrmuOqcfrkrb"),
//         firebase.db.doc("/exercise/Eh2pgt5Hxnu4gtMoDZhy"),
//         firebase.db.doc("/exercise/7VAJqZJDhwuigAyVD31O"),
//         firebase.db.doc("/exercise/lE6E2USURZi4vCbhfTtq"),
//         firebase.db.doc("/exercise/g1bm6d1da0W71xrP3fXu"),
//         firebase.db.doc("/exercise/Hkamr5L6WEZ41ohaXzvd"),
//         firebase.db.doc("/exercise/jExGwIBoHEbKE8T8htQm"),
//         firebase.db.doc("/exercise/hCuGf3J2uEp6igBV4B9T"),
//         firebase.db.doc("/exercise/8DE9scpjwUPFcwnqr8GP"),
//         firebase.db.doc("/exercise/oRhVThq32NJ2Aj1SXhAD"),
//       ],
//       phase: "Avanzada",
//       setup: {
//         repeticiones: 15,
//         series: 5,
//       },
//       title: "Semana 7",
//     },
//     week8: {
//       order: "11",
//       refs: [
//         firebase.db.doc("/exercise/Pi9PdHOACI05wzGQr2ug"),
//         firebase.db.doc("/exercise/eBwu9sDj2c3sKr1RfUAh"),
//         firebase.db.doc("/exercise/dGriEyLXjLjH2R7wIukE"),
//         firebase.db.doc("/exercise/vmAyuFTswxkEg3aSwmr0"),
//         firebase.db.doc("/exercise/EzsHbO23Pf3wFuKYnh9r"),
//         firebase.db.doc("/exercise/VBhwlZSIOkshoRmfDfmt"),
//         firebase.db.doc("/exercise/noIXpOt2AiduYtOINCe9"),
//         firebase.db.doc("/exercise/6KEU1u127n61HLXL1new"),
//         firebase.db.doc("/exercise/xROgvDg29tateC3PM4uq"),
//         firebase.db.doc("/exercise/3HAmDnIWlIqRFiXXhWo4"),
//       ],
//       phase: "Avanzada",
//       setup: {
//         repeticiones: 20,
//         series: 6,
//       },
//       title: "Semana 8",
//     },
//     week9: {
//       order: "12",
//       refs: [
//         firebase.db.doc("/exercise/gZ4p5DhWoKYkrrNC8cPQ "),
//         firebase.db.doc("/exercise/bhLn72bBAr63G3TjcDxq"),
//         firebase.db.doc("/exercise/8F9b5CLVPY5GiZz2X8GS"),
//         firebase.db.doc("/exercise/ljUkzvWcUBvWXu6PaUUn"),
//         firebase.db.doc("/exercise/dhb6rrAX1jFnLi5nAhLG"),
//         firebase.db.doc("/exercise/w1lW97wQyWmRd0oXnRIo"),
//         firebase.db.doc("/exercise/RD4QFrzro7VwDCUO6lgq"),
//         firebase.db.doc("/exercise/MapG4cC5kaODCRrtoDdR"),
//         firebase.db.doc("/exercise/rSdN4VaEXoBPZaPBMuPa")
//       ],
//       phase: "Avanzada",
//       setup: {
//         repeticiones: 20,
//         series: 8,
//       },
//       title: "Semana 9",
//     },
//     week10: {
//       order: "12",
//       refs: [
//         firebase.db.doc("/exercise/bZTkpEdoc9UuQjKqnpW4"),
//         firebase.db.doc("/exercise/cb00ScTwA4OEdMZq4Wzv"),
//         firebase.db.doc("/exercise/xXbRCQ0kHQk92WpDer0C"),
//         firebase.db.doc("/exercise/qayvX9W9fs2BBtbCCKAd"),
//         firebase.db.doc("/exercise/AvCpZctjIdqXWouVHsmM"),
//         firebase.db.doc("/exercise/MR8xRIH4befPjjc5PsS4"),
//         firebase.db.doc("/exercise/ZDLzGQ33CMSgaDq1103f"),
//         firebase.db.doc("/exercise/KceisEseBKlrvGNhFELF"),
//         firebase.db.doc("/exercise/QhaGgIlCOiFqUAFtY62k"),
//         firebase.db.doc("/exercise/ltkqHtpQsO6bZE6M4Y5A"),
//       ],
//       phase: "Avanzada",
//       setup: {
//         repeticiones: 20,
//         series: 10,
//       },
//       title: "Semana 10",
//     },
//   };
//   await firebase.db.collection("protocol").doc("preprotesico").set(array);
// };
