import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Alert, Linking, TextInput } from "react-native";

var { vmin } = require("react-native-expo-viewport-units");
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { AnimatedCircularProgress } from "react-native-circular-progress";

import firebase from "../../../database/firebase";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { ScrollView } from "react-native-gesture-handler";

import Logowhatsapp from "react-native-vector-icons/Ionicons";
import Bell from "react-native-vector-icons/FontAwesome";
import RoutineHistory from "./RoutineHistory";
import ChargeScreen from "../Simple/ChargeScreen";

const renderUser = (user, props) => {
  let trainingPhase = user.control.trainingPhase;
  let activeWeek = user.control.activeWeek;
  let activeDay = user.control.activeDay;

  let activeWeekPercentage = parseInt(activeWeek.replace("week", ""), 10) * 10;
  let activeDayPercentage = activeDay * 2;
  const PercentageOfCompletion = activeDayPercentage + activeWeekPercentage;
  console.log("percetange week ", activeWeekPercentage);
  console.log("percetange day ", activeDayPercentage);
  console.log("percetange", PercentageOfCompletion);
  // if(PercentageOfCompletion===110){
  //   PercentageOfCompletion=100
  // }
  return (
    <View
      key={user.uid}
      style={userListStyles.container}
    >
      <View style={userListStyles.header}>
        <Text style={userListStyles.headerTitle}>{user.personal.name}</Text>
        {/* <Text style={userListStyles.headerSubtitle}>{user.personal.name}</Text> */}
      </View>

      <View style={userListStyles.body}>
        <View style={userListStyles.leftSide}>
          <Text style={userListStyles.textState}>Estado</Text>

          <View style={userListStyles.progressSection_circle}>
            <AnimatedCircularProgress
              size={vmin(28)}
              width={vmin(2)}
              fill={PercentageOfCompletion}
              tintColor="#6979F8"
              backgroundColor="rgba(228, 228, 228, 1)"
              rotation={0}
            >
              {(fill) => {
                console.log("fill---", PercentageOfCompletion);
                return <Text>{fill}%</Text>;
              }}
            </AnimatedCircularProgress>
          </View>

          <Text style={userListStyles.textDate}>04 junio 2021</Text>
          <Text style={userListStyles.textProgress}>
            {user.control.trainingPhase}
          </Text>
        </View>
        <View style={userListStyles.rightSide}>
          <View style={userListStyles.table}>
            <View style={userListStyles.row}>
              <View style={userListStyles.column1}>
                <Text style={userListStyles.text1}>Riesgo de Caida:</Text>
              </View>

              <View style={userListStyles.column2}>
                <Text style={userListStyles.text2}>40</Text>
              </View>
            </View>

            <View style={userListStyles.row}>
              <View style={userListStyles.column1}>
                <Text style={userListStyles.text1}>Esfuerzo Percibido:</Text>
              </View>

              <View style={userListStyles.column2}>
                <Text style={userListStyles.text2}>
                  {user.medical.perceivedForce}
                </Text>
              </View>
            </View>

            <View style={userListStyles.row}>
              <View style={userListStyles.column1}>
                <Text style={userListStyles.text1}>Configuración:</Text>
              </View>

              <View style={userListStyles.column2}>
                <Text style={userListStyles.text2}>90%</Text>
              </View>
            </View>

            <View style={userListStyles.row}>
              <View style={userListStyles.column1}>
                <Text style={userListStyles.text1}>Acompañante:</Text>
              </View>

              <View style={userListStyles.column2}>
                <Text style={userListStyles.text2}>
                  {user.companionEmail == "" ? "No Registrado" : "Registrado"}
                </Text>
              </View>
            </View>
          </View>

          <View style={userListStyles.iconsContainer}>
            <TouchableOpacity
              style={{
                backgroundColor: "#d8d8d8",
                borderRadius: 5,
              }}
              onPress={() =>
                props.navigation.navigate("UserTabs", {
                  uid: user.uid,
                })
              }
            >
              <Logowhatsapp
                name="information-circle-outline"
                size={vmin(12)}
                color="#444444"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#d8d8d8",
                borderRadius: 5,
                padding: 6,
              }}
              onPress={() => props.navigation.navigate("UserEventList", {
                patientId: user.uid,
              })}
            >
              <Bell name="bell-o" size={vmin(10)} color="#444444" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#25D366",
                borderRadius: 5,
                padding: 6,
              }}
              onPress={() => {
                const saveFormSingleUserEvent = async () => {
                  Linking.openURL(
                    "https://api.whatsapp.com/send?text=Hola! " +
                      user.personal.name + " me estoy contactando contigo por reportaste un evento. Por favor me indiques que paso." +
                      "&phone=+57" +
                      user.personal.phone
                  );
                };
              saveFormSingleUserEvent();
              }}
            >
              <Logowhatsapp
                name="logo-whatsapp"
                size={vmin(10)}
                color="#ffffff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const HomePhysiotherapist = (props) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  // const logOut = async () => {
  //   // props.navigation.navigate("Login");
  //   // await firebase.auth.signOut();

  //   // this.checkAsync();
  //   Alert.alert(
  //     "Cerrar Sesión",
  //     "¿Está seguro que quiere cerrar sesión? ",
  //     [
  //       {
  //         text: "Cancelar",
  //         onPress: () => {},
  //         style: "cancel",
  //       },
  //       {
  //         text: "Cerrar Sesión",
  //         onPress: async () => {
  //           props.navigation.navigate("Login");
  //           await firebase.auth.signOut();
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  // };

  const getUsers = async () => {
    let collection 
    const collection1= await firebase.db
      .collection("users")
      .where("physioEmail", "==", props.user.email)
      .get();
    const collection2 = await firebase.db.collection("users").where("personal.id", "==", filter).get();
    filter == ""  ? collection = collection1 : collection = collection2
  
    let exercisesProcessed: any = collection.docs.map((doc) => {
      return {
        ...doc.data(),
        uid: doc.id,
      };
    });

    console.log("Los ejercicios son", exercisesProcessed);

    setUsers(exercisesProcessed);
    setLoading(false);
  };
  useEffect(() => {
    getUsers();
  }, []);
  if (loading) {
    return (<View style={{backgroundColor: "#ffffff", justifyContent:"center",height:"100%", width:"100%"}}><ChargeScreen/></View>);
  } else {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: vmin(4.5), fontWeight: "bold" }}>
          {props.user.information.personal.name}
        </Text>
        <Text style={{ fontSize: vmin(3) }}>
          {props.user.information.personal.email}
        </Text>
        
      </View>
<View style={styles.containerInput}>
          
          <TextInput
            style={styles.input}
            onChangeText={(value) => {setFilter(value)}}
            placeholder={"Filtrar por cédula de usuario"}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {getUsers()}}
          >
            <Text style={{ color: "white" , fontSize: vmin(6)}}>➔</Text>
          </TouchableOpacity>
        </View>
      <ScrollView style={styles.body}>
        {users.map((user) => renderUser(user, props))}
      </ScrollView>

      <View style={styles.footer}>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("UserEventList")}
        >
          <Text style={{ color: "white" }}>Eventos</Text>
        </TouchableOpacity> */}
        {props.connection && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              props.navigation.navigate("UpdatePhysioData", {props:props})
            }
          >
            <Text style={{ color: "white" }}>Editar Perfil</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
          }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
    connection: store.User.connection,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(
  MapStateToProps,
  MapDispatchToProps
)(HomePhysiotherapist);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "8%",
     backgroundColor: "rgba(105,121,248,0.5)",
    // borderColor: "rgba(21, 21, 34, 1)",
    // borderBottomWidth: vmin(0.4),
    alignItems: "flex-start",
    paddingLeft:10,
    paddingTop:4
  },

  body: {
    width: "100%",
    height: "82%",
    //backgroundColor: "peru",
  },

  footer: {
    width: "100%",
    height: "10%",
    // backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },
  
  containerInput: {
    height: "5%",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    // backgroundColor: "tomato",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "2%",
    marginTop: "2%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },

  input: {
    height: "100%",
    width: "90%",
    textAlign: "center",
    borderColor: "rgba(228, 228, 228, 0.6)",
    borderWidth: 2,
    borderRadius: 5,
  },
   
  filterButton: {
    backgroundColor: "#6979F8",
    width: "18%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "2%",
  },

  button: {
    backgroundColor: "#6979F8",
    width: "90%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
    borderRadius: 10,
  },
});

const userListStyles = StyleSheet.create({
  container: {
    width: "90%",
    height: vmin(62),
    // backgroundColor: "tomato",
    marginBottom: vmin(2),
    marginTop: vmin(2),
    marginLeft: "5%",
  },

  leftSide: {
    width: "30%",
    height: "80%",
    backgroundColor: "rgba(240,240,240,1)",
    borderRadius: 10,
    justifyContent: "center",
  },

  rightSide: {
    width: "70%",
    height: "100%",
    // backgroundColor: "blue",
  },

  progressSection_circle: {
    height: "50%",
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    margin: "5%",
  },
  table: {
    width: "90%",
    marginLeft: "5%",
    height: "50%",
    // backgroundColor: "yellow",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "orange",
  },
  column1: {
    width: "60%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  column2: {
    width: "40%",
    alignItems: "flex-start",
  },
  text1: {
    color: "#666666",
    textAlign: "left",
  },
  text2: {
    color: "black",
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
    // backgroundColor: "salmon",
  },
  textState: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "3%",
  },
  textDate: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: "5%",
    fontSize: vmin(2.5),
  },
  textProgress: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: vmin(5),
    marginBottom: "3%",
    color: "#6979F8",
    fontStyle: "italic",
  },
  iconsContainer: {
    height: "30%",
    //backgroundColor:"salmon",
    width: "90%",
    marginLeft: "5%",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },

  header: {
    width: "100%",
    height: "18%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: vmin(5),
    marginTop: "3%",
    marginBottom: "5%",
  },
  headerSubtitle: { color: "#999999" },
  body: {
    width: "100%",
    height: "90%",
    flexDirection: "row",
  },
});
