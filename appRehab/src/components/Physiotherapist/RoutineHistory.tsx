import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Picker,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

var { vmin } = require("react-native-expo-viewport-units");

// iconos
import IconCheck from "react-native-vector-icons/FontAwesome";

// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { ScrollView } from "react-native-gesture-handler";

const RoutineHistory = ({ props }) => {
  const { userInformation } = props.props;
console.log("record---", userInformation.record)
  const renderPhases = () => {
    const { record } = userInformation;
    let keyPhases = Object.keys(record);
    return (
      <>
        {keyPhases.map((phase, index) => {
          return (
            <View key={index}>
              <Text
                style={{
                  fontSize: vmin(6),
                  fontWeight: "500",
                  marginLeft: vmin(1),
                }}
              >
                {phase}
              </Text>
              {renderWeeks(record[phase])}
            </View>
          );
        })}
      </>
    );
  };

  const renderWeeks = (weekArray) => {
    let keysArray = Object.keys(weekArray);
    return (
      <>
        {keysArray
          .map((week) => parseInt(week.replace("week", ""), 10))
          .sort()
          .map((week, index) => {
            return (
              <View key={index}>
                <Text
                  style={{
                    fontStyle: "italic",
                    fontSize: vmin(5),
                    fontWeight: "500",
                    marginLeft: vmin(2),
                    marginTop: vmin(1),
                  }}
                >
                  Semana {week}
                </Text>
                {renderDays(weekArray["week" + week])}
              </View>
            );
          })}
      </>
    );
  };

  const renderDays = (arrayDays) => {
    return (
      <>
        {arrayDays
          .filter((position) => position != 0)
          .map((day, index) => {
            return (
              <View style={stylesDay.card} key={index}>
                <View style={stylesDay.header}>
                  <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                    Dia {index + 1}
                  </Text>
                  <IconCheck
                    name="calendar-o"
                    size={vmin(5.5)}
                    color="rgba(219, 219, 219,1)"
                  />
                </View>
                <View style={stylesDay.body}>{renderAttemps(day)}</View>
              </View>
            );
          })}
      </>
    );
  };

  const renderAttemps = (arrayAttemps) => {
    return (
      <>
        {arrayAttemps.map((attemp, intento) => {
          return (
            <View style={attempsStyles.card} key={intento}>
              <View style={attempsStyles.leftSide}>
                {attemp.endRoutine == "Si" ? (
                  <IconCheck
                    name="check"
                    size={vmin(5.5)}
                    color="rgba(60, 227, 0,1)"
                  />
                ) : (
                  <IconCheck
                    name="close"
                    size={vmin(5.5)}
                    color="rgba(199, 0, 57,1)"
                  />
                )}
              </View>

              <View style={attempsStyles.rightSide}>
                <View style={attempsStyles.row}>
                  <View style={attempsStyles.column1}>
                    <Text style={attempsStyles.title1}>Intento:</Text>
                  </View>

                  <View
                    style={[
                      attempsStyles.column2,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text style={attempsStyles.title2}>{intento + 1}</Text>
                    <Text>{new Date(attemp.reportTime).toDateString()}</Text>
                  </View>
                </View>

                <View style={attempsStyles.row}>
                  <View style={attempsStyles.column1}>
                    <Text style={attempsStyles.title1}>
                      Esfuerzo Percibido:
                    </Text>
                  </View>

                  <View style={attempsStyles.column2}>
                    <Text style={attempsStyles.title2}>
                      {attemp.percivedEffort}
                    </Text>
                  </View>
                </View>

                <View style={[attempsStyles.row]}>
                  <View style={attempsStyles.column1}>
                    <Text style={attempsStyles.title1}>
                      Razón de inclumplimiento:
                    </Text>
                  </View>

                  <View style={attempsStyles.column2}>
                    <Text style={attempsStyles.title2}>{attemp.why}</Text>
                  </View>
                </View>

                <View style={attempsStyles.row}>
                  <View style={attempsStyles.column1}>
                    <Text style={attempsStyles.title1}>Descripción:</Text>
                  </View>

                  <View style={attempsStyles.column2}>
                    <Text style={[attempsStyles.title2, {flexWrap: "wrap"}]}>
                      {attemp.commentary}
                    </Text>
                  </View>
                </View>
              </View>

              {/* uid: "Firhf3E96SNtpdfBKF */}
            </View>
          );
        })}
      </>
    );
  };

  if (userInformation.loading) {
    return <ActivityIndicator size="large" color="#00ff00" />
  }else if(Object.keys(userInformation.record).length===0){
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
  } else {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.body}>{renderPhases()}</ScrollView>
      </View>
    );
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(RoutineHistory);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "10%",
    backgroundColor: "blue",
    borderColor: "rgba(236, 236, 236, 1)",
    borderBottomWidth: vmin(0.4),
    alignItems: "center",
  },

  body: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },
});

const stylesDay = StyleSheet.create({
  card: {
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 8,
    // },
    // shadowOpacity: 0.44,
    // shadowRadius: 10.32,
    // elevation: 16,

    // backgroundColor: "green",
    marginBottom: vmin(2),
    borderRadius: 10,
    width: "90%",
    marginLeft: "5%",
    marginTop: vmin(3),
  },

  header: {
    flexDirection: "row",
    borderColor: "rgba(236, 236, 236, 1)",
    borderBottomWidth: vmin(0.4),
    height: vmin(10),
    alignItems: "center",
    justifyContent: "space-around",
  },

  body: {
    // backgroundColor: "blue",
  },
});

const attempsStyles = StyleSheet.create({
  card: {
    borderColor: "rgba(236, 236, 236, 1)",
    borderBottomWidth: vmin(0.4),
    flexDirection: "row",
    justifyContent: "center",
    marginTop: vmin(3),
  },

  leftSide: {
    width: "6%",
    justifyContent: "center",
    alignItems: "center",
  },

  rightSide: { width: "94%", justifyContent: "center", alignItems: "center" },

  row: { width: "100%", flexDirection: "row", marginLeft: "5%" },

  column1: {
    width: "50%",
    // alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  column2: {
    width: "50%",
    // alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "blue",
  },

  title1: { color: "black" },
  title2: { fontWeight: "600", color: "#666666" },
});
