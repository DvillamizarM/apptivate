import React, { Component, useEffect, useState } from "react";
import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import UserInformation from "../../components/Physiotherapist/UserInformation";

import UserProtocol from "../../components/Physiotherapist/UserProtocol";

import firebase from "../../../database/firebase";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

const FirstRoute = (props) => <UserInformation props={props} />;

const SecondRoute = (props) => <UserProtocol props={props} />;

var { vmin } = require("react-native-expo-viewport-units");

function Repository(props) {
  const [userInformation, setUserInformation] = useState({ loading: true});

  const getInformation = async () => {
    let patientIdentifier = props.navigation.state.params.uid;
    console.log(
      "{}{}{}{}P{}{}{}{}{}{}{}{}{}}el id del paciente que llegas es ",
      patientIdentifier
    );
    let info: any = {};
    await firebase.db
      .collection("users")
      .doc(patientIdentifier)
      .get()
      .then((user: any) => {
        info = user.data();
        info["loading"] = false;
        console.log("La informaicon qudo asi ;", info);
      })
      .catch((e) => {
        // setLoading(false);
      });

    let record = await firebase.db
      .collection("endRoutine")
      .where("uid", "==", patientIdentifier)
      .get();

    info["record"] = filterRecord(record);
    info["uid"] = props.navigation.state.params.uid
    console.log(
      "La informacion es :::::::::::: :::::::::::: :::::::::::: :::::::::::: ::::::::::::",
      info
    );
    setUserInformation(info);
  };

  const filterRecord = (collection) => {
    let record: any = {};
    collection.docs.forEach((doc, index) => {
      console.warn(
        "Esta es la iteracion numerooooooooooooooooooooooooooooooooooooo",
        index,
        record
      );
      let currentDocument = {
        ...doc.data(),
        id: doc.id,
      };
      let activeWeek = currentDocument.week;
      let activeDay = currentDocument.day;
      let trainingPhase = "";
      if (parseInt(activeWeek.replace("week", ""), 10) <= 3) {
        trainingPhase = "Fase Inicial";
      } else if (parseInt(activeWeek.replace("week", ""), 10) <= 7) {
        trainingPhase = "Fase Intermedia";
      } else {
        trainingPhase = "Fase Avanzada";
      }
      // Verificacion para saber si la fase existe
      if (record[trainingPhase]) {
        console.log(
          "Aqui la fase ya habia sido creada aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          record
        );
        //Verificacion si existe la semana
        if (record[trainingPhase][activeWeek]) {
          console.table("Aqui la semana 1 ya existia ", record);
          //Verificacion si existe el dia
          if (record[trainingPhase][activeWeek][activeDay] != 0) {
            record[trainingPhase][activeWeek][activeDay].push({
              ...currentDocument,
            });
          }
          // Verificaccion si no existe el dia
          else {
            record[trainingPhase][activeWeek][activeDay] = [
              { ...currentDocument },
            ];
          }
        }
        // Si no existe la semana
        else {
          console.log("La semana no existia ", record);
          record[trainingPhase][activeWeek] = [0, 0, 0, 0, 0, 0, 0];
          record[trainingPhase][activeWeek][activeDay] = [
            { ...currentDocument },
          ];
        }
      }
      // si no existe la fase
      else {
        record[trainingPhase] = {};
        record[trainingPhase][activeWeek] = [0, 0, 0, 0, 0, 0, 0];
        record[trainingPhase][activeWeek][activeDay] = [{ ...currentDocument }];
      }
    });
    console.log("======= El resuldato de la semana es :", record);

    return record;
  };
  
  useEffect(() => {
    getInformation();
  }, []);


  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Datos" },
    { key: "second", title: "Protocolo" },
  ]);

  const renderScene = SceneMap({
    first: () => FirstRoute({ props, userInformation }),
    second: () => SecondRoute({ props, userInformation }),
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      swipeEnabled={false}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width, height: layout.height }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          renderLabel={({ route, color }) => (
            <Text style={{ color: "#6979F8", margin: 8, textAlign: "center" }}>
              {route.title}
            </Text>
          )}
          indicatorStyle={{ backgroundColor: "#6979F8" }}
          style={{
            backgroundColor: "white",
          }}
        />
      )}
    />
  );
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(Repository);
