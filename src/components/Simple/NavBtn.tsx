import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
var { vmin, vh } = require("react-native-expo-viewport-units");

const NavViewSelector = ({ props }) => {
  // console.log(
  //   "🚀 ~ file: NavBtn.tsx ~ line 7 ~ NavViewSelector ~ props",
  //   props
  // );
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.showNavSelect}
      onRequestClose={() => {
        props.setShowNavSelect(false);
      }}
    >
      <View style={styles.modelMainView}>
        <View style={styles.modelBeforScroll}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
          >
            {props.phases &&
              props.phases.map((element, index) => {
                return (
                  <View key={element.key + index} style={styles.modelItem}>
                    {/* <ScrollView> */}
                    {/* <View
                      style={{
                        height: "100%",
                        width: "100%",
                        // backgroundColor: "yellow",
                      }}
                    > */}
                    <TouchableOpacity
                      style={{
                        // backgroundColor: "green",
                        width: "100%",
                        justifyContent: "center",
                        height: "100%",
                      }}
                      onPress={() => {
                        console.warn("clicked====", element);
                        props.setCurrentInformation(element.key);
                        // setValue(element);
                        props.setShowNavSelect(false);
                      }}
                    >
                      <Text
                        style={{
                          textAlignVertical: "center",
                          marginLeft: "5%",
                        }}
                      >
                        {element.title}
                      </Text>
                    </TouchableOpacity>
                    {/* </View> */}

                    {/* </ScrollView> */}
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const NavBtn = ({ props }) => {
  // console.log("🚀 ~ file: NavBtn.js ~ line 73 ~ NavBtn ~ props", props);
  const [showNavSelect, setShowNavSelect] = useState(false);
  const CurrentInformation = props.CurrentInformation;
  const setCurrentInformation = props.setCurrentInformation;
  const phases = props.phases;
  const setLoading = props.setLoading;

  // console.log("🚀 ~ file: NavBtn.tsx ~ line 78 ~ NavBtn ~ phases", phases);

  return (
    // <View style={{ width: "auto", height: "auto" }}>

    <View style={navigationStyles.containerNavigationButton}>
      <NavViewSelector
        props={{
          phases,
          showNavSelect,
          setShowNavSelect,
          setCurrentInformation,
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setLoading(true);
          if (CurrentInformation - 1 >= 0) {
            setCurrentInformation(parseInt(CurrentInformation) - 1);
          } else {
            setCurrentInformation(phases.length - 1);
          }
        }}
        style={navigationStyles.sideButton}
      >
        <Text style={[navigationStyles.whiteText, { fontSize: vmin(5) }]}>
          {"<"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowNavSelect(true);
        }}
        style={navigationStyles.navigationButtonText}
      >
        <Text style={navigationStyles.whiteText}>
          {phases[CurrentInformation] && phases[CurrentInformation].title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={navigationStyles.sideButton}
        onPress={() => {
          setLoading(true);
          if (CurrentInformation + 2 <= phases.length) {
            setCurrentInformation(parseInt(CurrentInformation) + 1);
          } else {
            setCurrentInformation(0);
          }
        }}
      >
        <Text style={[navigationStyles.whiteText, { fontSize: vmin(5) }]}>
          {">"}
        </Text>
      </TouchableOpacity>
    </View>
    // </View>
  );
};

const navigationStyles = StyleSheet.create({
  containerNavigationButton: {
    width: "90%",
    display: "flex",
    flexDirection: "row",
    // marginTop: vmin(2),
    height: "80%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(105, 121, 248, 1)",
  },

  sideButton: {
    minWidth: "15%",
    width: "15%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  navigationButtonText: {
    height: "100%",
    minWidth: "60%",
    width: "60%",
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

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    //  alignSelf: "stretch",
    borderColor: "#e3e3e3",
    //  / minHeight: "100%",
    borderWidth: 1,
    //backgroundColor:"orange",
    borderRadius: 4,
  },

  scroll: {
    flex: 1,
    height: "auto",
    borderRadius: 10,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icons: {
    //   backgroundColor: "#e3e3e3",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    borderRadius: 4,
  },
  modelMainView: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(244,244,244,0.7)",
  },
  modelBeforScroll: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    maxHeight: "50%",
    borderRadius: 10,
  },
  modelItem: {
    // position: "absolute",
    backgroundColor: "#ffffff",
    // borderRadius: 20,
    alignSelf: "center",
    width: "100%",
    height: vh(6),
  },
});
