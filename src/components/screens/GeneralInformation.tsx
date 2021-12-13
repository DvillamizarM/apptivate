import React, { Component, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";

var { vmin } = require("react-native-expo-viewport-units");
import Download from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
// redux
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import {
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
} from "rn-tourguide";
import firebase from "../../../database/firebase";
import { actionsDownload } from "../../redux/actions/actionsDownload";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import ChargeScreen from "../Simple/ChargeScreen";

const GeneralInformation = (props) => {
  const [information, setInformation] = useState([]);
  const [CurrentInformation, setCurrentInformation] = useState(2);
  const [exists, setExistence] = useState(false);
  const [isFocused, setIsFocused] = useState(
    props.props.navigation.isFocused()
  );
  const [toggledState, setToggledState] = useState(1);
  const [pending, setPending] = useState(false);
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
    getCurrentStep,
  } = useTourGuideController();

  const handleOnStart = () => console.log("start");
  const handleOnStop = () => console.log("stop");
  const handleOnStepChange = (step) => {
    console.log("step--", step);
    if (step === undefined) {
      props.updateShowTour1(false), stop;
    } else {
      console.log("step num=---", step.order);
    }
    console.log(`stepChange`);
  };

  const getGeneralInformation = async () => {
    if (props.connection) {
      console.log("propy==", props.repoIndex);
      const snapshot = await firebase.db.collection("generalInfo").get();
      let res: any = snapshot.docs.map((doc) => doc.data());
      // console.warn("======", res);
      setInformation(res);
    } else {
      //console.warn("props-----", props.generalInfo);
      setInformation(props.generalInfo);
    }
  };

  const downloadSection = async (title, element: any, index) => {
    let fileUri: string = "";
    if (element.multimedia !== "") {
      fileUri = `${FileSystem.documentDirectory}${title + index}`;
      const downloadedFile: FileSystem.FileSystemDownloadResult =
        await FileSystem.downloadAsync(element.multimedia, fileUri);
    } else {
      fileUri = "na";
    }
    let item = {
      id: index,
      amputationLevel: element.amputationLevel,
      description: element.description,
      material: element.material,
      multimedia: fileUri,
      title: element.title,
    };
    // console.warn("paso---", validateExists(title, index));
    if (!validateExists(title, index)) {
      console.warn("in if =---", item);
      props.downloadInfo({ title, item });
      setExistence(!exists);
    }
    //});
  };
  function findElement(title, index) {
    let location: Array<number> = [];
    let tempIds = props.generalInfoIds;
    let tempInfo = props.generalInfo;
    if (tempIds !== undefined && tempIds.includes(title)) {
      const modIndex: number = tempIds.indexOf(title);
      let modInfo = tempInfo[modIndex];
      modInfo.content.forEach((element, elementIndex) => {
        if (element.id === index) {
          location.push(modIndex, elementIndex);
          return;
        }
      });
    }
    return location;
  }
  const deleteMultimedia = async (uri) => {
    try {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + uri);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteInformation = async (title, index) => {
    const location = findElement(title, index);
    console.warn("location----", location);
    const uri = props.generalInfo[location[0]].content[location[1]].multimedia;
    const dlete = await deleteMultimedia(uri);
    props.deleteInfo(location);
    setExistence(!exists);
  };

  function validateExists(title, index) {
    let result = false;
    let tempIds = props.generalInfoIds;
    let tempInfo = props.generalInfo;
    // console.warn("valdiate tiele --", title, "---index---", index)
    //console.warn("temp---", tempInfo)
    if (tempIds !== undefined && tempIds.includes(title)) {
      const modIndex = tempIds.indexOf(title);
      // console.warn("index---", modIndex)
      let modInfo = tempInfo[modIndex];
      // console.warn("modinfo---", modInfo.content)
      modInfo.content.forEach((element) => {
        // console.warn("elemente id-- ", element.id)
        if (element.id === index) {
          //console.warn("in if")
          result = true;
          return;
        }
        //   console.warn("jumped if")
      });
    }
    return result;
  }

  useEffect(() => {
    let mounted = true;
    if (information.length === 0) {
      //  console.warn("exists effect-----", exists);
      if (mounted) {
        getGeneralInformation();
      }
    }
    return () => {
      mounted = false;
    };
  }, []);

  // useEffect(() => {
  //   console.warn("second effect-----", canStart);
  //   if (canStart) {
  //     // 👈 test if you can start otherwise nothing will happen
  //     start();
  //   }
  // }, [canStart]);

  // useEffect(() => {
  //   console.warn("third effect-----");
  //   eventEmitter.on("start", handleOnStart);
  //   eventEmitter.on("stop", handleOnStop);
  //   eventEmitter.on("stepChange", handleOnStepChange);

  //   return () => {
  //     eventEmitter.off("start", handleOnStart);
  //     eventEmitter.off("stop", handleOnStop);
  //     eventEmitter.off("stepChange", handleOnStepChange);
  //   };
  // }, []);
  useEffect(() => {
    //
    //console.warn("tour-----", props);
    if (props.showTour1 && props.repoIndex === 0 && canStart) {
      console.warn("in effect if");
      start();
      // console.warn("get current", getCurrentStep())
    }
  }, [canStart]);

  useEffect(() => {
    //  console.warn("third effect-----");
    if (eventEmitter !== undefined) {
      eventEmitter.on("start", handleOnStart);
      eventEmitter.on("stop", () => {
        console.warn("end");
        stop;
      });
      eventEmitter.on("stepChange", handleOnStepChange);

      return () => {
        eventEmitter.off("start", handleOnStart);
        eventEmitter.off("stop", handleOnStop);
        eventEmitter.off("stepChange", handleOnStepChange);
      };
    }
  }, []);

  const NavigationButton = () => {
    return (
      <View style={styles.containerNavigationButton}>
        <TouchableOpacity
          onPress={() => {
            if (CurrentInformation + 1 < information.length) {
              setCurrentInformation(CurrentInformation + 1);
            } else {
              if (props.navigation) {
                props.navigation.navigate("Home");
              } else {
                setCurrentInformation(0);
              }
            }
          }}
          style={styles.sideButton}
        >
          <Text style={[styles.whiteText, { fontSize: vmin(5) }]}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.navigationButtonText}>
          <Text style={styles.whiteText}>
            {information[CurrentInformation].title}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => {
            if (CurrentInformation - 1 >= 0) {
              setCurrentInformation(CurrentInformation - 1);
            } else if (CurrentInformation === 0) {
              setCurrentInformation(information.length - 1);
            }
          }}
        >
          <Text style={[styles.whiteText, { fontSize: vmin(5) }]}>{">"}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CardInformation = (title, element, index) => {
    console.warn("multipp-----",element.multimedia)
    let description;
    function setDescription() {
      try {
        description = JSON.parse(element.description);
      } catch (e) {
        description = element.description;
      }
      description = description.split("•");
    }
    setDescription();

    let existsInDownloads = validateExists(title, index);
    // console.warn("exists--------", exists);
    const style = {
      borderRadius: 10,
      paddingBottom: 15,
    };

    description.length > 1 ? description.shift() : "";

    return (
      <View key={"general" + index} style={styles.cardInformation}>
        <Text style={{ fontWeight: "bold" }}>{element.title}</Text>

          {element.multimedia !== "" && element.multimedia !== "na" ? (
            <View style={styles.containerImage}>
              <Image
                source={{ uri: element.multimedia }}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
            </View>
          ) : <View></View>}
        <View style={styles.containerDescription}>
          {description.map((text, key_index) => {
            return (
              <Text
                key={"text" + key_index}
                style={{ fontSize: vmin(4.5), textAlign: "justify" }}
              >
                {"• " + text}
              </Text>
            );
          })}
        </View>
        <TourGuideZone
          zone={3}
          text={
            "Para tener acceso a esta información sin conexión a internet pulse aquí para descargar."
          }
          borderRadius={16}
          tooltipBottomOffset={80}
        >
          {!props.connection || existsInDownloads ? (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => {
                // Alert.alert(" ALert on press ");
                if (props.connection) {
                  Alert.alert(
                    "Eliminar " + element.title,
                    "¿Está seguro que quiere eliminar la descarga de " +
                      element.title +
                      "?",
                    [
                      {
                        text: "Cancelar",
                        style: "cancel",
                      },
                      {
                        text: "Eliminar",
                        onPress: async () => {
                          deleteInformation(
                            information[CurrentInformation].title,
                            index
                          );
                        },
                      },
                    ],
                    { cancelable: false }
                  );
                } else {
                  Alert.alert(
                    "Para eliminar " +
                      element.title +
                      " debes estar conectado al internet."
                  );
                }
              }}
            >
              <Text style={{ color: "rgba(52, 152, 219, 1)" }}>Descargado</Text>
              <MaterialIcons
                name="file-download-done"
                size={vmin(7)}
                color="rgba(52, 152, 219, 1)"
              />
            </TouchableOpacity>
          ) : !pending ? (
            <TouchableOpacity
              onPress={async () => {
                //Alert.alert(title);
                Alert.alert(
                  "Descargar " + element.title,
                  "¿Está seguro que quiere descargar " + element.title + "?",
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Descargar",
                      onPress: async () => {
                        setPending(true);
                        downloadSection(
                          information[CurrentInformation].title,
                          element,
                          index
                        );
                        // setPending(false);
                        //console.log("information--------", element);
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={styles.downloadButton}
            >
              <Text style={{ color: "rgba(153, 153, 153, 1)" }}>Descargar</Text>
              <Download
                name="md-download-outline"
                size={vmin(7)}
                color="rgba(153, 153, 153, 1)"
              />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "rgba(52, 152, 219, 1)" }}>
                Descargando
              </Text>
              <ActivityIndicator size="small" color="rgba(52, 152, 219, 1)" />
            </View>
          )}
        </TourGuideZone>
      </View>
    );
  };

  if (information.length == 0) {
    if (!props.connection) {
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
            No hay descargas
          </Text>
        </View>
      );
    } else {
      return (
        <View
          style={{ justifyContent: "center", height: "100%", marginTop: "5%" }}
        >
          <ChargeScreen />
        </View>
      );
    }
  } else {
    // console.warn("props====", props);
    // console.warn("current inf-----", information[CurrentInformation]);

    let level = "";
    props.props.navigation.getParam("amputationLevel") !== undefined
      ? (level = props.props.navigation.getParam("amputationLevel"))
      : props.user.information.medical.amputationLevel !== undefined
      ? (level = props.user.information.medical.amputationLevel)
      : (level = "");
    // console.warn(
    //   "params---------",
    //   props.props.navigation.getParam("amputationLevel")
    // );
    // console.warn(
    //   "user info---------",
    //   props.user.information.medical.amputationLevel
    // );
    let leakedInformation = information[CurrentInformation].content.filter(
      (element) => {
        // console.warn("element----", element);
        // console.warn("level-----", level);
        if (level === "") {
          //no amputation level specified
          console.warn("general info return element else");
          return element;
        } else {
          //amputation level registered
          //  console.warn("in if -------", level);
          if (
            element.amputationLevel === "" ||
            element.amputationLevel === level
          ) {
            return element;
          }
        }

        // if (
        //   (props.user.information.role = "paciente") ||
        //   props.props.navigation.getParam("amputationLevel") !== undefined
        // ) {
        //   // console.log("else")
        //   let level = "";
        //   props.props.navigation.getParam("amputationLevel") !== undefined
        //     ? (level = props.props.navigation.getParam("amputationLevel"))
        //     : (level = props.user.information.medical.amputationLevel);
        //   // console.warn("leve----", level);
        //   return (
        //     element.amputationLevel == "" || element.amputationLevel == level
        //   );
        // } else {
        //   console.warn("general info return element else");
        //   return element;
        // }
      }
    );
    return (
      <View>
        <View style={styles.container}>
          <TourGuideZoneByPosition
            zone={1}
            shape={"rectangle"}
            text={
              "Utilice estos botones para explorar la información dentro del catálogo. Esta información es validada por expertos. Le va a servir de apoyo para el manejo de su amputación y proceso de rehabilitación."
            }
            isTourGuide
            top={"-10%"}
            left={0}
            width={"100%"}
            height={"10%"}
          />
          <View style={styles.header}>
            {/* <Text style={{ color: "rgba(34, 34, 34, 1)" }}>
            Información Básica
          </Text> */}
            {/* <SegmentedControl
              values={["Sin Prótesis", "Con Prótesis", "Ambos"]}
              selectedIndex={toggledState}
              style={{ height: "40%", width: "90%", marginTop: "2%" }}
              activeFontStyle={{ color: "#000000", fontWeight: "bold" }}
              onChange={(event) => {
                console.warn(
                  "index----",
                  event.nativeEvent.selectedSegmentIndex
                );
                setToggledState(event.nativeEvent.selectedSegmentIndex);
              }}
            /> */}
            <TourGuideZone
              zone={2}
              text="La información esta organizada por categoría. Con las flechas de los lados se puede mover por las categorías."
              borderRadius={16}
            >
              <NavigationButton />
            </TourGuideZone>
          </View>

          {/*  </TourGuideZone> */}
          <ScrollView style={styles.body}>
            <TourGuideZone
              zone={4}
              text={
                "Cuando esté sin internet podrá ver la información descargada aquí mismo."
              }
              borderRadius={16}
              tooltipBottomOffset={50}
            >
              {leakedInformation.map((element, index) => {
                return CardInformation(
                  information[CurrentInformation].title,
                  element,
                  index
                );
              })}
            </TourGuideZone>
          </ScrollView>
        </View>
      </View>
    );
  }
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  //console.warn("mappp-----", store.User.user);
  // console.warn("mappp ids-----", store.DownloadReducer.GeneralInfoIds);
  // console.warn("mappp-----", store.DownloadReducer.GeneralInfo);
  // console.warn("mappp ids-----", store.DownloadReducer.GeneralInfoIds);
  // console.warn("show tour1-----", store.User.showTour1);
  return {
    connection: store.User.connection,
    user: store.User.user,
    repoIndex: store.User.repoIndex,
    showTour1: store.User.showTour1,
    generalInfo: store.DownloadReducer.GeneralInfo,
    generalInfoIds: store.DownloadReducer.GeneralInfoIds,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setConnection: (value) => dispatch(actionsUser.SET_CONNECTION(value)),
  updateShowTour1: (val) => dispatch(actionsUser.SHOW_TOUR1(val)),
  setRepoIndex: (val) => dispatch(actionsUser.SET_REPOINDEX(val)),
  downloadInfo: (val) => dispatch(actionsDownload.ADD_GENERAL_INFO(val)),
  deleteInfo: (val) => dispatch(actionsDownload.REMOVE_GENERAL_INFO(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(GeneralInformation);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "15%",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: "rgba(21, 21, 34, 1)",
    //  borderBottomWidth: vmin(0.2),
    // backgroundColor: "green",
  },

  body: {
    width: "100%",
    height: "85%",
    //  backgroundColor: "pink"
  },

  containerNavigationButton: {
    width: "90%",
    flexDirection: "row",
    marginTop: vmin(2),
    height: "65%",
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

  cardInformation: {
    width: "100%",
  //  backgroundColor: "green",
    //justifyContent: "space-evenly",
    alignItems:"flex-start",
    borderColor: "rgba(21, 21, 34, 1)",
    borderBottomWidth: vmin(0.4),
    paddingLeft: "10%",
    paddingRight: "10%",
    paddingBottom: "5%",
    marginBottom: "10%",
  },

  downloadButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  containerDescription: {
    marginTop: vmin(3),
    fontSize: vmin(1),
    marginBottom: vmin(2),
  },

  containerImage: {
    width: "100%",
    flexDirection: "row",
    height: vmin(70),
  },
});
