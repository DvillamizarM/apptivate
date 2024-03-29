import React, { Component, useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";

import firebase from "../../../database/firebase";
import Download from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Video, AVPlaybackStatus } from "expo-av";

var { vmin } = require("react-native-expo-viewport-units");

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { actionsDownload } from "../../redux/actions/actionsDownload";

import * as FileSystem from "expo-file-system";

import NavigateNext from "react-native-vector-icons/MaterialIcons";
import ChargeScreen from "../Simple/ChargeScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import Picker from "../Simple/Picker";
import { NavBtn } from "../Simple/NavBtn";

const ExerciseRoutine = (props) => {
  const [CurrentInformation, setCurrentInformation] = useState(0);
  const level = props.level;
  const [information, setInformation]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [exists, setExistence] = useState(false);
  const [pending, setPending] = useState(-1);
  const [phases, setPhases]: any = useState([]);

  const organizePhases = (list) => {
    const tempPhase: any = [];
    Object.keys(list).forEach((phase: any) => {
      tempPhase.push({ title: list[phase].title, key: phase });
    });
    setPhases(tempPhase);
  };

  const getProtocol = async (phase) => {
    
    let passed = 0;
    let list: any = [];
    // const level = protocol[CurrentInformation].key;
    if (props.connection) {
      await firebase.db
        .collection("protocol")
        .doc(phase)
        .get()
        .then((element) => {
          let data: any = element.data();

          const otherList = Object.values(data).map(
            async (element2: any, index) => {
              const trainingPhase =
                props.user.information.control === undefined
                  ? ""
                  : props.user.information.control.trainingPhase &&
                    props.user.information.control.trainingPhase !== ""
                  ? props.user.information.control.trainingPhase
                  : "";
              if (element2.refs.length > 0) {
                let info: any = [];
                let temp = {
                  title: element2.title,
                  phase: element2.phase,
                  setup: element2.setup,
                  order: element2.order,
                  exercises: [],
                };
                const promises = element2.refs.map(async (ref, index) => {
                  await ref.get().then((res) => {
                    info.push(res.data());
                  });
                  return info;
                });
                await Promise.all(promises).then((finished: Object) => {
                  temp.exercises = finished[0];
                  (temp.phase === "" ||
                    temp.phase === trainingPhase ||
                    trainingPhase === "") &&
                    list.push(temp);
                 
                  if (
                    (trainingPhase === "" && list.length === 13) ||
                    (trainingPhase === "Avanzada" &&
                      list.length === 7 - passed) ||
                    (trainingPhase === "Intermedia" &&
                      list.length === 6 - passed) ||
                    (trainingPhase === "Inicial" && list.length === 6 - passed)
                  ) {
                    list.sort(function (a, b) {
                      return a.order - b.order;
                    });
                    setInformation(list);
                    props.setProtocols({ ...props.protocols, [phase]: list });
                    phases.length === 0 && organizePhases(list);
                    // setLoading(false);
                  } 
                });
              } else {
                if (trainingPhase === "" || trainingPhase === element2.phase) {
                  passed++;
                }
              }
            }
          );
        })
        .catch((e) => {
          console.log("El error es ", e);
        });
    } else if (!props.connection) {
      setInformation(props.ExerciseRoutine);
    }
    return list;
  };

  const getUrls = (items) => {
    let urlList: any = [];
    items.forEach((element) => {
      urlList.push(element.gif);
    });
    return urlList;
  };

  const getAudioUrls = (items) => {
    let urlList: any = [];
    items.forEach((element) => {
      urlList.push(element.voz);
    });
    return urlList;
  };

  const cachePhase = async (currentPhase) => {
    const revisedExercises: any = [];
    const tempCache: any = [];
    const levelId = currentPhase.title.includes("Semana") ? props.level : "";

    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "cache",
      { intermediates: true }
    );
    await Promise.all(
      currentPhase.exercises.map(async (exercise, index) => {
        const fileUri: string = exercise.gif.includes("gif")
          ? `${FileSystem.documentDirectory + "cache/"}${
              currentPhase.title + levelId + "gif" + index
            }`
          : `${FileSystem.documentDirectory + "cache/"}${
              currentPhase.title + levelId + index
            }`;
        let audioUri: string = `${FileSystem.documentDirectory}${
          exercise.routinePhase + currentPhase.phase + "Audio" + index
        }`;
        await FileSystem.downloadAsync(exercise.gif, fileUri);
        await FileSystem.downloadAsync(exercise.voz, audioUri);

        let tempExercise = exercise;
        tempExercise.gif = fileUri;
        tempExercise.voz = audioUri;
        tempCache.push(fileUri);
        tempCache.push(audioUri);
        revisedExercises.push(tempExercise);
        // return tempExercise;
      })
    );

    revisedExercises.sort((a, b) => {
      const numberA = a.gif.match(/\d+$/)[0];
      const numberB = b.gif.match(/\d+$/)[0];
      return numberA - numberB;
    });
    return revisedExercises;
  };

  const setCached = () => {
    const levelId = information[CurrentInformation].title.includes("Semana")
      ? props.level
      : "";
    cachePhase(information[CurrentInformation]).then((revisedExercises) => {
     
      let newInfo = information;
      newInfo[CurrentInformation].exercises = revisedExercises;

      setInformation(newInfo);
      props.setProtocols({ ...props.protocols, [level]: newInfo });
      setLoading(false);
    });
  };

  useEffect(() => {
    if (loading) {
      if (information && information.length === 0) {
        props.protocols[level] === undefined
          ? getProtocol(level)
          : setInformation(props.protocols[level]) &&
            setPhases(props.protocols[level]);
      } else {
        if (
          information[CurrentInformation].exercises[0].gif.includes("firebase")
        ) {
          setCached();
        } else {
          loading && setLoading(false);
        }
      }
    }
  }, [phases, CurrentInformation]);

  const downloadSection = async ({ sectionIndex, title, title2 }) => {
    const urls = getUrls(information[sectionIndex].exercises);
    const audioUrls: any = getAudioUrls(information[sectionIndex].exercises);
    let items: any = [...information];
    title2 = title2 === "title2" ? "" : title2;
    await Promise.all(
      urls.map(async (element, index) => {
        const fileUri: string = `${FileSystem.documentDirectory}${
          title + title2 + index
        }`;
        let audioUri: string = `${FileSystem.documentDirectory}${
          title + title2 + "Audio" + index
        }`;
        await FileSystem.moveAsync({
          from: `${items[sectionIndex].exercises[index].gif}`,
          to: `${FileSystem.documentDirectory}${title + title2 + index}`,
        });

        // await FileSystem.downloadAsync(element, fileUri);
        if (audioUrls[index].length > 25) {
          // await FileSystem.downloadAsync(audioUrls[index], audioUri);

          await FileSystem.moveAsync({
            from: `${items[sectionIndex].exercises[index].voz}`,
            to: `${FileSystem.documentDirectory}${
              title + title2 + "Audio" + index
            }`,
          });
        } else {
          audioUri = "";
        }
        let item = {
          ...items[sectionIndex].exercises[index],
          voz: audioUri,
          gif: fileUri,
        };
        items[sectionIndex].exercises[index] = item;
      })
    )
      .then(() => {
        setInformation(items);
        if (!props.previusIdentifiers.includes(title + title2)) {
          let sectionToSave = information[sectionIndex];
          props.addItemToExerciseRoutine({
            newExercise: sectionToSave,
            title,
            title2,
          });
        }
        setExistence(!exists);
      })
      .catch((e) => {
        console.warn("promise all download---", e);
      });
  };

  const deleteMultimedia = async (uri) => {
    try {
      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteInformation = (sectionIndex, order, title, title2) => {
    props.ExerciseRoutine.forEach(async (phase, index) => {
      if (phase.order === order) {
        phase.exercises.forEach(async (exercise) => {
          const dlete = await deleteMultimedia(exercise.gif);
          if (exercise.voz.length > 25) {
            const dlete = await deleteMultimedia(exercise.voz);
          }
        });

        props.deleteExercise({ order, title, title2 });
        setExistence(!exists);
      }
    });
  };

  const FirstSection = (info, sectionIndex) => {
    let title = info.phase !== "" ? info.phase : info.title;
    let title2 = info.phase !== "" ? info.title : "";

    let existsInDownloads = props.previusIdentifiers.includes(title + title2);

    let exercises: any = [];
    info.exercises.forEach((element, index) => {
      if (element !== undefined) {
        let tempExercise = {};
        tempExercise["exerciseList"] = element;
        tempExercise["setup"] = info.setup;
        exercises.push(tempExercise);
      }
    });

    return (
      <View style={FirstSectionStyles.container}>
        <View style={{ alignItems: "center" }}>
          <View style={FirstSectionStyles.rowContainer}>
            <Text style={FirstSectionStyles.title}>
              {title === "Inicial" ||
              title === "Intermedia" ||
              title === "Avanzada"
                ? "Etapa: " + title
                : title}
            </Text>
            <View style={FirstSectionStyles.iconContainer}>
              {/* <NavigateNext name="navigate-next" size={vmin(7)} color="black" /> */}

              {existsInDownloads ? (
                <TouchableOpacity
                  style={FirstSectionStyles.downloadButton}
                  onPress={() => {
                    // Alert.alert(" ALert on press ");
                    if (props.connection) {
                      Alert.alert(
                        "Eliminar " + title,
                        "¿Está seguro que quiere eliminar la descarga de " +
                          title +
                          "?",
                        [
                          {
                            text: "Cancelar",
                            style: "cancel",
                          },
                          {
                            text: "Eliminar",
                            onPress: async () => {
                              const dlete = await deleteInformation(
                                sectionIndex,
                                info.order,
                                title,
                                title2
                              );
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    } else {
                      Alert.alert(
                        "Por favor conéctese al internet para eliminar."
                      );
                    }
                  }}
                >
                  <Text style={{ color: "rgba(52, 152, 219, 1)" }}>
                    Descargado
                  </Text>
                  <MaterialIcons
                    name="file-download-done"
                    size={vmin(7)}
                    color="rgba(52, 152, 219, 1)"
                  />
                </TouchableOpacity>
              ) : pending !== sectionIndex ? (
                <TouchableOpacity
                  onPress={async () => {
                    //Alert.alert(title);
                    Alert.alert(
                      "Descargar " + title,
                      "¿Está seguro que quiere descargar " +
                        title +
                        " " +
                        title2 +
                        "?",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel",
                        },
                        {
                          text: "Descargar",
                          onPress: async () => {
                            setPending(sectionIndex);
                            const download = await downloadSection({
                              sectionIndex,
                              title,
                              title2,
                            });
                            setPending(-1);
                          },
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                  style={FirstSectionStyles.downloadButton}
                >
                  <Text style={{ color: "rgba(153, 153, 153, 1)" }}>
                    Descargar
                  </Text>
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
                  <ActivityIndicator
                    size="small"
                    color="rgba(52, 152, 219, 1)"
                  />
                </View>
              )}
            </View>
          </View>
          {(title === "Inicial" ||
            title === "Intermedia" ||
            title === "Avanzada") && (
            <Picker
              width={"90%"}
              height={28}
              // placeholder={"Protesico"}
              setData={(itemValue, itemIndex) => {
                if (level !== itemValue) {
                  setLoading(true);
                  const dataKey =
                    itemValue === "Preprotésico" ? "preprotesico" : "protesico";
                  new Promise((resolve) => {
                    resolve(props.setRepoLevel(dataKey));
                  }).then(() => {
                    if (props.protocols[dataKey] === undefined) {
                      getProtocol(dataKey).then(() => setLoading(false));
                    } else {
                      new Promise((resolve) =>
                        resolve(setInformation(props.protocols[dataKey]))
                      ).then(() => setLoading(false));
                    }
                  });
                }
              }}
              // initialValue={"Protésico"}
              value={level === "protesico" ? "Protésico" : "Preprotésico"}
              list={["Protésico", "Preprotésico"]}
            />
          )}
        </View>
        <View>
          <View style={SecondSectionStyles.container}>
            {/* <Text style={SecondSectionStyles.title}>{title2}</Text> */}

            <View style={{}}>
              <FlatList
                data={exercises}
                renderItem={OverviewExercise}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: "5%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                keyExtractor={(item, index) => "overview" + index}
              />
            </View>
          </View>
          {/* <SecondSection key={"sec2" + 1} element={info} /> */}
        </View>
      </View>
    );
  };

  const OverviewExercise = (item) => {
    let value = item.item;
    let exercise = value.exerciseList;

    let multimedia = exercise.gif !== undefined ? exercise.gif : "hello";
    let materials = exercise.materials;
    let materialsBackground =
      materials !== "" ? "rgba(142, 255, 127 ,1)" : "rgba(255, 136, 110,1)";

    let key_e = item.index;

    return (
      <TouchableOpacity
        key={key_e + "e"}
        style={OverviewExerciseStyles.container}
        onPress={() => {
          props.props.navigation.navigate("IndividualExcercise", {
            data: exercise,
            setup: value.setup,
          });
        }}
      >
        <Text style={{ marginTop: "2%", fontWeight: "700" }}>
          Ejercicio #{parseInt(item.index) + 1}
        </Text>
        <View style={OverviewExerciseStyles.imageContainer}>
          {multimedia.includes("gif") ? (
            <Image
              source={{ uri: multimedia }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 13,
              }}
            />
          ) : (
            <Video
              source={{ uri: multimedia }}
              resizeMode="stretch"
              isLooping
              usePoster
              shouldPlay
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 13,
              }}
            />
          )}
        </View>
        <View style={OverviewExerciseStyles.containerTexts}>
          {/* <Text style={OverviewExerciseStyles.title}>{day}</Text> */}
          {/* <Text style={OverviewExerciseStyles.subtitle}>{time}</Text> */}
          {/* <Text
            style={[
              OverviewExerciseStyles.subtitle,
              { backgroundColor: materialsBackground },
            ]}
          >
            Materiales {materials ? "✅" : "❌"}
          </Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // ============================================================ ui ============================

  if (loading) {
    return (
      <View style={{ justifyContent: "center", height: "100%" }}>
        <ChargeScreen />
      </View>
    );
  } else if (information && information.length !== 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text> Coleccion de ejercicios. </Text> */}
          {phases && (
            <NavBtn
              props={{
                CurrentInformation,
                setCurrentInformation,
                phases,
                setLoading,
              }}
            />
          )}
          {/* {NavigationButton()} */}
        </View>

        <View style={styles.body}>
          {information &&
            information[CurrentInformation] &&
            phases &&
            phases[CurrentInformation] &&
            FirstSection(information[CurrentInformation], CurrentInformation)}
          {/* {information.map((aaa, index) => FirstSection(aaa, index))} */}
        </View>
      </View>
    );
  } else if (!props.connection) {
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
      <View style={{ justifyContent: "center", height: "100%" }}>
        <ChargeScreen />
      </View>
    );
  }
};
const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
    level: store.User.repoLevel,
    connection: store.User.connection,
    previusIdentifiers: store.DownloadReducer.ExerciseRoutineIndentifiers,
    ExerciseRoutine: store.DownloadReducer.ExerciseRoutine,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  addItemToExerciseRoutine: (data) =>
    dispatch(actionsDownload.ADD_ITEM_TO_EXERCISE_ROUTINE(data)),
  removeExercises: (data) =>
    dispatch(actionsDownload.REMOVE_EXERCISE_LIST(data)),
  setRepoLevel: (val) => dispatch(actionsUser.SET_REPOLEVEL(val)),
  deleteExercise: (data) =>
    dispatch(actionsDownload.REMOVE_EXERCISE_ITEM(data)),
});
export default connect(MapStateToProps, MapDispatchToProps)(ExerciseRoutine);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
  },

  header: {
    width: "100%",
    height: "9%",
    // backgroundColor: "salmon",

    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: "rgba(21, 21, 34, 1)",
    // borderBottomWidth: vmin(0.4),
  },

  body: {
    width: "100%",
    height: "88%",
    // backgroundColor: "red"
  },
});

const navigationStyles = StyleSheet.create({
  containerNavigationButton: {
    width: "90%",
    flexDirection: "row",
    // marginTop: vmin(2),
    height: "80%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(105, 121, 248, 1)",
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

const FirstSectionStyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    // backgroundColor: "green",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    // borderColor: "rgba(21, 21, 34, 1)",
    // borderBottomWidth: vmin(0.4),
    // marginTop: vmin(-4),
    paddingBottom: "5%",
    paddingLeft: "2%",
    // backgroundColor: "peru",
    paddingRight: "2%",
  },
  rowContainer: {
    // marginTop: "1%",
    flexDirection: "row",
  },
  title: {
    paddingLeft: "4%",
    fontWeight: "bold",
    width: "65%",
    height: "auto",
    fontSize: vmin(4.5),
  },
  iconContainer: {
    width: "35%",
    justifyContent: "center",
    alignItems: "flex-end",
    // backgroundColor: "red",
  },

  downloadButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

const SecondSectionStyles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-evenly",
    padding: "3%",
    paddingTop: "0%",
  },

  title: {
    // marginBottom: vmin(),
    fontWeight: "bold",
    fontSize: vmin(3),
    fontStyle: "italic",
  },
});

const OverviewExerciseStyles = StyleSheet.create({
  container: {
    width: vmin(90),
    height: vmin(100),
    borderStyle: "solid",
    borderTopWidth: 2,
    borderColor: "rgba(64,64,64,0.05)",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#96a8fa11",
    marginTop: vmin(4),
  },

  containerTexts: {
    width: "100%",
    height: "20%",
  },

  title: {
    fontSize: vmin(3),
    fontWeight: "bold",
    width: "100%",
    textAlign: "center",
  },

  subtitle: {
    padding: "3%",
    fontSize: vmin(4.5),
    color: "black",
    width: "100%",
    textAlign: "center",
  },

  imageContainer: {
    overflow: "hidden",
    maxWidth: "80%",
    maxHeight: "90%",
    width: "80%",
    height: "90%",
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
});
