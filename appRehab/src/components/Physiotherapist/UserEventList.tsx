// UserEventList
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Picker,
  Image,
  TouchableOpacity,
} from "react-native";

var { vmin } = require("react-native-expo-viewport-units");
import firebase from "../../../database/firebase";

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { ScrollView } from "react-native-gesture-handler";

const renderReport = (report, props) => {
  console.log("Las props que llegan son :", report, " y ademas:", props);
  return (
    <TouchableOpacity
      key={report.id}
      style={reportStyles.container}
      onPress={() =>
        props.navigation.navigate("SingleUserEvent", {
          report,
        })
      }
    >
      <View style={reportStyles.table}>
        

        <View style={reportStyles.row}>
          <View style={reportStyles.column1}>
            <Text style={reportStyles.text1}>Fecha:</Text>
          </View>
          <View style={reportStyles.column2}>
            <Text numberOfLines={1} style={reportStyles.text2}>
              {JSON.stringify(new Date(report.creationTime))}
            </Text>
          </View>
        </View>


        <View style={reportStyles.row}>
          <View style={reportStyles.column1}>
            <Text style={reportStyles.text1}>Dolor:</Text>
          </View>
          <View style={reportStyles.column2}>
            <Text style={reportStyles.text2}>{report.degreeOfPain}</Text>
          </View>
        </View>

        <View style={reportStyles.row}>
          <View style={reportStyles.column1}>
            <Text style={reportStyles.text1}>Tipo de Evento:</Text>
          </View>
          <View style={reportStyles.column2}>
            <Text style={reportStyles.text2}>{report.eventType}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const UserEventList = (props) => {
  const [reports, setReports] = useState([]);
  console.log("event list----",props.navigation.state.params.patientId);

  const getReports = async () => {
    console.log("usidee---", props)
    let reportsProcessed: any = [];
    const collection = await firebase.db
      .collection("ReportedEvents")
      .where("userId", "==", props.navigation.state.params.patientId)
      .get()
      .then((querySnapshot) => {
          console.warn("dta------",querySnapshot)
        reportsProcessed = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          };
        })
      });

    console.log("Los ejercicios son", reportsProcessed);

    setReports(reportsProcessed);
  };

  useEffect(() => {
    getReports();
  }, []);
  if(reports.length===0){
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            fontSize: vmin(8),
            color: "rgba(153, 153, 153, 1)",
            marginTop: "50%",
          }}
        >
          No hay eventos
        </Text>
      </View>
    );
  }else{
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontStyle: "italic", alignItems: "center" }}>
          Lista de Eventos Registrados
        </Text>
      </View>

      <ScrollView style={styles.body}>
        {reports.map((user) => renderReport(user, props))}
      </ScrollView>

    </View>
  );}
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(UserEventList);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "10%",
    // backgroundColor: "orange",
    borderColor: "rgba(21, 21, 34, 1)",
    borderBottomWidth: vmin(0.4),
    alignItems: "center",
    justifyContent: "center",
  },

  body: {
    width: "100%",
    height: "80%",
    // backgroundColor: "peru",
  },

  footer: {
    width: "100%",
    height: "10%",
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
});

const reportStyles = StyleSheet.create({
  table: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    // backgroundColor: "orange",
  },
  column1: {
    width: "35%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  column2: {
    width: "70%",
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
  container: {
    width: "90%",
    height:"12%",
    borderBottomWidth:1,
    borderRadius: 3,
    justifyContent:"space-evenly",
    // shadowColor: "#000",
    
    // shadowOpacity: 0.41,
    // shadowRadius: 3.11,
    // elevation: 0.5,
    margin: "5%",
    // backgroundColor: "#CDD2FD",
  },
});
