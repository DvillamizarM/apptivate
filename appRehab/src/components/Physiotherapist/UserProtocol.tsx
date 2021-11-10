import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
var { vmin } = require("react-native-expo-viewport-units");

import RoutineHistory from "./RoutineHistory";
import CustomizePatient from "./CustomizePatient";

export default function UserProtocol(props) {
  const [navigationPosition, setnavigationPosition] = useState(0);
  const navigationTitles = ["Historial", "Personalización"];
  console.warn("props protocolo customize", props); 
  const NavigationButton = () => {
    return (
      <View style={navigationButtonStyles.containerNavigationButton}>
        <TouchableOpacity
          onPress={() => {
            if (navigationPosition - 1 >= 0) {
              setnavigationPosition(navigationPosition - 1);
            }
          }}
          style={navigationButtonStyles.sideButton}
        >
          <Text
            style={[navigationButtonStyles.whiteText, { fontSize: vmin(5) }]}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <View style={navigationButtonStyles.navigationButtonText}>
          <Text style={navigationButtonStyles.whiteText}>
            {navigationTitles[navigationPosition]}
          </Text>
        </View>
        <TouchableOpacity
          style={navigationButtonStyles.sideButton}
          onPress={() => {
            if (navigationPosition + 1 < navigationTitles.length) {
              setnavigationPosition(navigationPosition + 1);
            }
          }}
        >
          <Text
            style={[navigationButtonStyles.whiteText, { fontSize: vmin(5) }]}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>{NavigationButton()}</View>
      <ScrollView style={styles.scroll}>
        {navigationPosition === 0 ? (
          <RoutineHistory props={props} />
        ) : (
          <CustomizePatient props={props} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "10%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "5%",
    marginRight: "5%",
  },
  container: { backgroundColor: "white", width: "100%", height: "100%" },

  scroll: {
    height: "90%",
    width: "100%",
  },
});

const navigationButtonStyles = StyleSheet.create({
  containerNavigationButton: {
    width: "100%",
    flexDirection: "row",
    height: "80%",
    borderRadius: 10,
    backgroundColor: "rgba(105, 121, 248, 1)",
    justifyContent: "center",
    alignItems: "center",
  },

  sideButton: {
    height: "100%",
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  navigationButtonText: {
    height: "70%",
    width: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderLeftWidth: vmin(0.5),
    borderRightWidth: vmin(0.5),
  },

  whiteText: {
    color: "white",
  },
});
