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
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
// import { fcmService } from "../../services/FCMService";
// import { localNotificationService } from "../../services/LocalNotificationService";
import { AppState } from "react-native";
// import SplashScreen from 'react-native-splash-screen';

import NetInfo from "@react-native-community/netinfo";
import firebase from "../../../database/firebase";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

var { vmin } = require("react-native-expo-viewport-units");

import Login from "./Login";

// iconos

import NavigateNext from "react-native-vector-icons/MaterialIcons";

import BookOutline from "react-native-vector-icons/Ionicons";

import Dumbbell from "react-native-vector-icons/MaterialCommunityIcons";

import User_o from "react-native-vector-icons/FontAwesome";

import Download from "react-native-vector-icons/Ionicons";

import Settings from "react-native-vector-icons/Ionicons";

// Pantalla del acompananate
import CompanionHome from "../companion/CompanionHome";

// pantalla del fisioterapista
import HomePhysiotherapist from "../Physiotherapist/HomePhysiotherapist";

// pantalla del administrador
import AdministratorHome from "../Administrator/AdministratorHome";
import GeneralProfileScreen from "../cards/GeneralProfileScreen";
import {
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
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
    initializing: true,
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
      //console.log(error);
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
    console.warn("checking");
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores?.map((result, i, store) => {
          console.log("saved data------", { [store[i][0]]: store[i][1] });
          return true;
        });
      });
    });
  }
  clearAllData() {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => Alert.alert("success"));
  }
  componentDidMount = () => {
   // console.warn("mounted value------", this.state.mounted);
    try {
      //this.checkAsync();
      //console.warn("exercise Props++++++", this.props.ExerciseRoutine)
      if (!this.props.cachedEndRoutines.empty) {
        this.syncCachedEndRoutines(this.props.cachedEndRoutines);
      }
      this.checkNetInfo();
      //  console.warn("repo-----", this.props.repoIndex)
      if (this.state.mounted) {
      //  console.warn("in is moutned mount-----", this.props);
        var temp = firebase.auth.onAuthStateChanged(this.onAuthStateChanged);
      }
    } catch (error) {
      console.warn("Home Error ---", error);
    }
  //  console.warn("mounted value b4 return------", this.state.mounted);
    //  return () => {

    //  }
    //  mounted = false,
    //   console.warn("mounted value return------", mounted)};
  };

  // componentDidUpdate() {
  //   if (!this.state.initializing) {
  //     let tempMounted = true;
  //     // this.props.user.information.role === ""
  //     //   ? (tempMounted = false)
  //     //   : (tempMounted = true);
  //     // this.setState({ mounted: tempMounted})
  //   }
  // }

  // shouldComponentUpdate() {
  //   // if (this.props.user.information.companionEmail !== "") {
  //   //  // console.warn("in should update if");
  //   //   return true;
  //   // }
  //  // console.warn("should update------", this.state.mounted);
  //   return this.state.mounted;
  // }

  // componentWillUnmount= () =>{
  //   this.state.unsubscribe()
  //   console.warn("unsubscribed")

  // }

  onAuthStateChanged = async (user) => {
    let user2 = {};
    if (user && user.email !== "") {
      // Si el usuario tiene una sesion activa se trae su informacion de la base de datos
      if (this.props.connection) {
        console.warn("onAuthStateChanged");
        await firebase.db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((user_db) => {
            let data: any = user_db.data();
            user2["uid"] = user.uid;
            user2["email"] = user.email;
            user2["information"] = data;
            console.log(
              "userr role in authstatechange----",
              user2.information.role
            );
            this.props.setUser(user2);
            const r = JSON.stringify(user2["information"]);
          })
          .then(() => {
            if (user2.information.token == "") {
              this.registerForPushNotificationsAsync();
            }
          })
          .catch((e) => {
            console.log("El error es ", e);
          });
      }
    }
    if (this.state.initializing) {
      this.setState({ initializing: false });
    }
  };

  syncCachedEndRoutines = async (list) => {
    let idRecord = "";
    list.forEach(async (form, index) => {
      console.warn("form---", form);
      console.warn("user----", this.props.user.uid);
      let res = await firebase.db.collection("endRoutine").add({
        ...form,
        day: this.props.user.information.control.activeDay,
        week: this.props.user.information.control.activeWeek,
        reportTime: new Date().getTime(),
        uid: this.props.user.uid,
      });
      idRecord = res.id;
      console.log("El id es ", idRecord);
      console.warn("length----", list.length, "-------- index---", index);
      if (form.endRoutine === "Si") {
        console.warn("in eyes");
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

    console.log(
      "Los antiguos cambios son trainingPhase",
      trainingPhase,
      " activeWeek ,",
      activeWeek,
      "activeDay",
      activeDay,
      old_record
    );
    // Inicial","Intermedia","Avanzada"

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
          console.log("Finalizacion");
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

      console.log(idRecord, "Los nuevos cambios son", {
        trainingPhase: new_trainingPhase,
        activeDay: new_activeDay,
        activeWeek: new_activeWeek,
        record: old_record,
      });

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
      title: "Rutina Finalizada!" + props.user.information.personal.name,
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
    //this.props.navigation.navigate("Login");
    //await firebase.auth.signOut();

    // this.checkAsync();
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
            this.props.navigation.navigate("Login");
            await firebase.auth.signOut();
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
        <TouchableOpacity
          style={styles.groupContainerOrange}
          onPress={() => {
            AsyncStorage.getItem("persist:root", (err, result) => {
              console.warn("AsyncMap -- ", JSON.parse(result));
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

        {/* <TouchableOpacity
          style={styles.groupContainer}
          onPress={() => this.props.navigation.navigate("UpdatePatient")}
        >
          <View style={styles.containerIcon}>
            <Settings name="settings-outline" size={vmin(10)} />
          </View>

          <View style={styles.containerText}>
            <Text style={styles.tile1}>Actualizar Datos</Text>
            <Text style={styles.tile2}>Cambiar datos personales</Text>
          </View>

          <View style={styles.arrowContainer}>
            <NavigateNext name="navigate-next" size={vmin(7)} />
          </View>
        </TouchableOpacity> */}
      </View>
    );
  };

  patientRegisterBody = () => {
    console.warn("patient register pbofy=---", this.props.user);
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
    
    if (this.state.initializing)
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
    else if (
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
                 this.props.navigation.navigate("UpdateInfo");
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
    //  console.warn("patient ino=---", this.props.user);
      return (
        <View style={styles.container}>
          {/* <View style={styles.header}>
            <Text style={{ fontWeight: "bold" }}>
              Hola {this.props.user.information.personal.name}
            </Text>
            <Text style={styles.textHeader}>
              Utiliza el menu para navegar por la app
            </Text>
          </View> */}
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
                 // this.clearAllData()
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
  //Alert.alert("-------",
  //  store.User.user.information ,
  //);
  //console.warn("Store-------",store.User.repoIndex);
  //console.warn("cached end----", store.DownloadReducer.SavedEndRoutines);
  //#FFE723
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
