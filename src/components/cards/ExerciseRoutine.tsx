import React, { Component, useEffect, useState } from "react";
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
} from "react-native";

import firebase from "../../../database/firebase";
import Download from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Video, AVPlaybackStatus } from 'expo-av';

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

const ExerciseRoutine = (props) => {
  const [information, setInformation] = useState([]);
  const [CurrentInformation, setCurrentInformation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exists, setExistence] = useState(false);
  const [pending, setPending] = useState(false);

  
  const video = React.useRef(null);

  const protocol = [
    { title: "Fase Preprotésica", key: "preprotesico" },
    {
      title: "Fase Protésica",
      key: "protesico",
    },
  ];

  const getProtocol = async () => {
    let passed = 0;
    let list: any = [];
    if (props.connection && information.length !== 14) {
      await firebase.db
        .collection("protocol")
        .doc("protesico")
        .get()
        .then((element) => {
          let data: any = element.data();
          const otherList = Object.values(data).map(
            async (element: any, index) => {
              const trainingPhase =
                props.user.information.control.trainingPhase &&
                props.user.information.control.trainingPhase !== ""
                  ? props.user.information.control.trainingPhase
                  : "";
              if (element.refs.length > 0) {
                let info: any = [];
                let temp = {
                  title: element.title,
                  phase: element.phase,
                  setup: element.setup,
                  order: element.order,
                  exercises: [],
                };
                const promises = element.refs.map(async (ref, index) => {
                  await ref.get().then((res) => {
                    info.push(res.data());
                  });
                  return info;
                });
                const finished = await Promise.all(promises).then(
                  (finished: Object) => {
                    temp.exercises = finished[0];
                    temp.phase === "" || temp.phase === trainingPhase
                      ? list.push(temp)
                      : console.log("passed");
                    console.warn("passed----", passed);
                    if (
                      (trainingPhase === "" && list.length === 13 - passed) ||
                      (trainingPhase === "Avanzada" &&
                        list.length === 7 - passed) ||
                      (trainingPhase === "Intermedia" &&
                        list.length === 6 - passed) ||
                      (trainingPhase === "Inicial" &&
                        list.length === 6 - passed)
                    ) {
                      console.log("exercise list---- ", list);
                      list.sort(function (a, b) {
                        return a.order - b.order;
                      });
                      setInformation(list);
                      setLoading(false);
                    }
                  }
                );
              } else {
                if (trainingPhase === "" || trainingPhase === element.phase) {
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
      setLoading(false);
    }
  };

  const getUrls = (items) => {
    // console.log(items);
    let urlList = [];
    items.forEach((element) => {
      urlList.push(element.gif);
    });
    return urlList;
  };

  const getAudioUrls = (items) => {
    let urlList = [];
    items.forEach((element) => {
      console.warn("voz====", items);
      urlList.push(element.voz);
    });
    return urlList;
  };

  useEffect(() => {
    let mounted = true;
    // console.warn("in useEffect----", mounted);
    if (mounted && information !== [] && loading) {
      console.warn("entreed");
      getProtocol();
    } else {
      console.warn("info----- eff---", information);
    }
    return () => {
      mounted = false;
    };
  }, []);

  const NavigationButton = () => {
    return (
      <View style={navigationStyles.containerNavigationButton}>
        <TouchableOpacity
          onPress={() => {
            if (CurrentInformation - 1 >= 0) {
              setCurrentInformation(CurrentInformation - 1);
            } else if (CurrentInformation === 0) {
              setCurrentInformation(1);
            }
          }}
          style={navigationStyles.sideButton}
        >
          <Text style={[navigationStyles.whiteText, { fontSize: vmin(5) }]}>
            {"<"}
          </Text>
        </TouchableOpacity>
        <View style={navigationStyles.navigationButtonText}>
          <Text style={navigationStyles.whiteText}>
            {protocol[CurrentInformation].title}
          </Text>
        </View>
        <TouchableOpacity
          style={navigationStyles.sideButton}
          onPress={() => {
            if (CurrentInformation + 1 < protocol.length) {
              setCurrentInformation(CurrentInformation + 1);
            } else if (CurrentInformation === 1) {
              setCurrentInformation(0);
            }
          }}
        >
          <Text style={[navigationStyles.whiteText, { fontSize: vmin(5) }]}>
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const downloadSection = async ({ sectionIndex, title, title2 }) => {
    const urls = getUrls(information[sectionIndex].exercises);
    const audioUrls = getAudioUrls(information[sectionIndex].exercises);
    let items: any = [...information];
    title2 = title2 === "title2" ? "" : title2;

    console.warn("item---", items);
    await Promise.all(
      urls.map(async (element, index) => {
        console.warn("url---", element);
        const fileUri: string = `${FileSystem.documentDirectory}${
          title + title2 + index
        }`;
        console.warn("uri---", fileUri);
        let audioUri: string = `${FileSystem.documentDirectory}${
          title + title2 + "Audio" + index
        }`;

        const downloadedFile: FileSystem.FileSystemDownloadResult =
          await FileSystem.downloadAsync(element, fileUri);
        if (audioUrls[index].length > 25) {
          console.warn("passed file download", audioUrls[index]);
          const downloadedFile1: FileSystem.FileSystemDownloadResult =
            await FileSystem.downloadAsync(audioUrls[index], audioUri);
        } else {
          audioUri = "";
        }
        let item = {
          ...items[sectionIndex].exercises[index],
          voz: audioUri,
          gif: fileUri,
        };
        console.warn("downloaded all----", item);
        items[sectionIndex].exercises[index] = item;

        setInformation(items);
      })
    )
      .then(() => {
        if (!props.previusIdentifiers.includes(title + title2)) {
          let sectionToSave = information[sectionIndex];
          console.warn("section---", information[sectionIndex]);
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
    console.warn("exercise routine--", props.ExerciseRoutine[sectionIndex]);
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

    console.log("info fisrt", info.exercises, info.title);

    let existsInDownloads = props.previusIdentifiers.includes(title + title2);
    const exercises = info.exercises.map((element, index) => {
      let tempExercise = {};
      tempExercise["exerciseList"] = element;
      tempExercise["setup"] = info.setup;
      return tempExercise;
    });
    return (
      <View style={FirstSectionStyles.container}>
        <View style={FirstSectionStyles.rowContainer}>
          <Text style={FirstSectionStyles.title}>{title}</Text>
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
            ) : !pending ? (
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
                          setPending(true);
                          const download = await downloadSection({
                            sectionIndex,
                            title,
                            title2,
                          });
                          setPending(false);
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
                <ActivityIndicator size="small" color="rgba(52, 152, 219, 1)" />
              </View>
            )}
          </View>
        </View>

        <View>
          <View style={SecondSectionStyles.container}>
            <Text style={SecondSectionStyles.title}>{title2}</Text>

            <View>
              <FlatList
                horizontal
                data={exercises}
                renderItem={OverviewExercise}
                style={{}}
                keyExtractor={(item, index) => item.key}
              />
            </View>
          </View>
          {/* <SecondSection key={"sec2" + 1} element={info} /> */}
        </View>
      </View>
    );
  };

  const SecondSection = (element) => {
    let title2 = element.phase !== "" ? "" : element.title;
    let exerciseCollection = element.exercises;
    return (
      <View style={SecondSectionStyles.container}>
        <Text style={SecondSectionStyles.title}>{title2}</Text>
        <View>
          <FlatList
            horizontal
            data={exerciseCollection}
            renderItem={OverviewExercise}
            style={{}}
            keyExtractor={(item, index) => item.key}
          />
        </View>
      </View>
    );
  };

  const OverviewExercise = (item) => {
    // console.warn("El item que llega al ejercicios es :", item.item);
    let value = item.item;
    let exercise = value.exerciseList;
    // let day = exercise.day;
    // let time = exercise.time;
    let multimedia = exercise.gif;
    let materials = exercise.materials;
    let materialsBackground =
      materials !== "" ? "rgba(142, 255, 127 ,1)" : "rgba(255, 136, 110,1)";

    let key_e = item.index;

    // console.warn(
    //   "La multimeodoas s props que tenemos hata aca son:::::::::::::::::",
    //   multimedia
    // );


    return (
      <TouchableOpacity
        key={key_e + "e"}
        style={OverviewExerciseStyles.container}
        onPress={() =>
         { console.warn("exercise itro--", exercise)
          props.props.navigation.navigate("IndividualExcercise", {
            data: exercise,
            setup: value.setup,
          })}
        }
      >
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
          <Text
            style={[
              OverviewExerciseStyles.subtitle,
              { backgroundColor: materialsBackground },
            ]}
          >
            Materiales {materials ? "✅" : "❌"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={{ justifyContent: "center", height: "100%", marginTop: "5%" }}
      >
        <ChargeScreen />
      </View>
    );
  } else if (information.length !== 0) {
    // console.warn("informacion--------", information);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <Text> Coleccion de ejercicios. </Text> */}
          {NavigationButton()}
        </View>

        <ScrollView style={styles.body}>
          {information.map((aaa, index) => FirstSection(aaa, index))}
        </ScrollView>
      </View>
    );
  } else {
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
  }
};
const MapStateToProps = (store: MyTypes.ReducerState) => {
  console.log(
    "exercise rotone reducer-------",
    store.DownloadReducer.ExerciseRoutine
  );
  return {
    user: store.User.user,
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
    height: "10%",
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
    marginTop: vmin(2),
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
    backgroundColor: "white",
    justifyContent: "space-evenly",
    borderColor: "rgba(21, 21, 34, 1)",
    borderBottomWidth: vmin(0.4),
    paddingTop: "5%",
    paddingBottom: "5%",
    paddingLeft: "2%",
    paddingRight: "2%",
  },
  rowContainer: {
    flexDirection: "row",
  },
  title: {
    paddingLeft: vmin(1),
    fontWeight: "bold",
    width: "65%",
    fontSize: vmin(4.3),
  },
  iconContainer: {
    width: "35%",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  downloadButton: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "red",
  },
});

const SecondSectionStyles = StyleSheet.create({
  container: {
    width: "100%",
    // backgroundColor: "peru",
    justifyContent: "space-evenly",
    padding: "3%",
  },

  title: {
    marginBottom: vmin(2),
    fontWeight: "bold",
    fontSize: vmin(3),
    fontStyle: "italic",
  },
});

const OverviewExerciseStyles = StyleSheet.create({
  container: {
    width: vmin(42),
    height: vmin(65),
    // backgroundColor: "yellow",
    marginRight: vmin(5),
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
    width: "100%",
    height: "80%",
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
