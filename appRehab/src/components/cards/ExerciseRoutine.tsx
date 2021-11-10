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

var { vmin } = require("react-native-expo-viewport-units");

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import { actionsDownload } from "../../redux/actions/actionsDownload";

import * as FileSystem from "expo-file-system";

import NavigateNext from "react-native-vector-icons/MaterialIcons";

const ExerciseRoutine = (props) => {
  const [information, setInformation] = useState([]);
  const [CurrentInformation, setCurrentInformation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exists, setExistence] = useState(false);
  const [pending, setPending] = useState(false);

  const protocol = [
    { title: "Fase Preprotésica", key: "preprotesico" },
    {
      title: "Fase Protésica",
      key: "protesico",
    },
  ];

  const basicPhaseExercises = async (exercises) => {
    const promises = exercises.map(async (Item) => {
      const numItem = await Item.get();
      return numItem;
    });

    return new Promise(async (resolve, reject) => {
      const numItems = await Promise.all(promises);

      resolve(numItems.map((e) => e.data()));
    });
  };

  const getBasicData = async () => {
    let dbRef = firebase.db
      .collection("protocol")
      .doc("protesico")
      .collection("basic");

    return dbRef.get().then(async (querySnapshot) => {
      const promises = querySnapshot.docs.map(async (doc) => {
        let ejerciciosXfase = Object.values(doc.data());
        let res = basicPhaseExercises(ejerciciosXfase);
        return res;
      });

      const arrayBasicExercises: any = await Promise.all(promises);

      let Array: any = [];

      const promises2 = querySnapshot.docs.map(async (doc, i) => {
        // doc.data() is never undefined for query doc snapshots
        Array.push({
          title1:
            doc.id == "cooldown"
              ? "Enfriamiento"
              : doc.id == "stretch"
              ? "Estiramiento"
              : "Calentamiento",
          collection: [
            {
              title2: "",
              exerciseCollection: arrayBasicExercises[i].map((e, j) => {
                // console.log(
                //   "3838383838383838383838888383838383838383383833838383838383833838383,",
                //   e
                // );
                return {
                  day: "Ejercicio " + (j - -1),
                  time: e.activeTime || "",
                  multimedia: e.gif,
                  materials: e.materials || false,
                  data: { ...e },
                };
              }),
            },
          ],
        });
      });

      //console.log("resultado #1", Array, " anres estaba", information);
      return Array;
    });
  };

  const getInformationWeeks = async () => {
    // var docRef = firebase.db.collection("protocol").doc("protesico");

    // // docRef = await docRef.get();
    // docRef.get().then((collections) => {
    //   console.log(
    //     "collection-----",
    //     collections.data()
    //   );
    // });
    // // let res = await docRef.get();
    // // console.log("*********", await res);
    let Array: any = [];
    let array2: any = [];
    let ArraySetup: any = [];

    for (let index = 0; index < 1; index++) {
      let dbRef = firebase.db
        .collection("protocol")
        .doc("protesico")
        .collection("week" + (index + 1))
        .doc("active");

      let res2 = await dbRef.get();
      let ejerciciosXfase = Object.values(res2.data());
      let res = await basicPhaseExercises(ejerciciosXfase);
      // console.log("ooooooooooo", res);
      array2.push(res);

      // Aqui se pide el setup por semanas
      let refSetup = firebase.db
        .collection("protocol")
        .doc("protesico")
        .collection("week" + (index + 1))
        .doc("setup");

      let getSetup = await refSetup.get();
      let setupValues = getSetup.data();
      // console.warn(
      //   "Setup Setup Setup Setup Setup Setup Setup Setup Setup ",
      //   setupValues
      // );
      ArraySetup.push(setupValues);
    }

    let map2 = array2.map((element, index) => {
      Array.push({
        title1: index <= 3 ? "Fase inicial" : "Fase intermedia",
        collection: [
          {
            title2: "Semana " + index + 1,
            exerciseCollection: element.map((e, j) => {
              // console.log(
              //   " El ejercio es -------------------<-<-<-<---------> : ",
              //   {
              //     ...e,
              //     ...ArraySetup[j],
              //   }
              // );
              return {
                day: "Ejercicio " + (j - -1),
                time: e.activeTime || "",
                multimedia: e.gif,
                materials: e.materials || false,
                data: { ...e, ...ArraySetup[j] },
              };
            }),
          },
        ],
      });
    });

    //  console.log("resultado #2", Array, " anres estaba", information);
    return Array;
  };

  const getUrls = (items) => {
    // console.log(items);
    let urlList = [];
    items.forEach((element) => {
      urlList.push(element.multimedia);
    });
    return urlList;
  };

  const getAudioUrls = (items) => {
    let urlList = [];
    items.forEach((element) => {
     console.warn("voz====",items);
       urlList.push(element.data.voz);
     
    });
    return urlList;
  };

  const getExercises = async () => {
    // console.log("connection----", props.connection)
    if (props.connection && information[0] === undefined) {
      // console.log("index 0 value info------",information[0])
      let basic: [] = await getBasicData();
      let weeks: [] = await getInformationWeeks();
//console.warn("weeks", weeks);
      let ordenado: any = [];
      ordenado[0] = basic[2];
      ordenado[1] = basic[1];

      let ordenado2 = ordenado.concat(weeks);
      ordenado2.push(basic[0]);
      //  console.log("retried from database------", ordenado2);

      setInformation(ordenado2);
      // Se guardan datos en el reducer
      setLoading(false);
    } else {
      // console.warn("eles exercise props", props.ExerciseRoutine)
      setInformation(props.ExerciseRoutine);
      //  console.warn("Hubo problemas de conexion");
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    // console.warn("in useEffect----", props.connection)
    if(mounted){
       getExercises();
    }return () => {mounted = false;}
   
  }, []);

  const NavigationButton = () => {
    return (
      <View style={navigationStyles.containerNavigationButton}>
        <TouchableOpacity
          onPress={() => {
            if (CurrentInformation - 1 >= 0) {
              setCurrentInformation(CurrentInformation - 1);
            }else if(CurrentInformation===0){
              setCurrentInformation(1)
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
            }else if(CurrentInformation===1){
              setCurrentInformation(0)
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

  const downloadSection = async ({ sectionIndex, title }) => {
    
    const urls = getUrls(
      information[sectionIndex].collection[0].exerciseCollection
    );
    const audioUrls = getAudioUrls(
      information[sectionIndex].collection[0].exerciseCollection
    );
    let items: any = [...information];
    console.warn("item---",items);
    await Promise.all(
      urls.map(async (element, index) => {
        const fileUri: string = `${FileSystem.documentDirectory}${
          title + index
        }`;
        const audioUri: string = `${FileSystem.documentDirectory}${
          title + "Audio" + index
        }`;

        const downloadedFile: FileSystem.FileSystemDownloadResult =
          await FileSystem.downloadAsync(element, fileUri);
          
     if(audioUrls[index] !== "cloudstorageID"){
        const downloadedFile1: FileSystem.FileSystemDownloadResult =
          await FileSystem.downloadAsync(audioUrls[index], audioUri);
     }
     console.warn("collection---", items[sectionIndex].collection[0].exerciseCollection[index].data.series);
        let item = {
          ...items[sectionIndex].collection[0].exerciseCollection[index],
          voz: audioUri,
          gif: fileUri,
          multimedia: fileUri,
          serie: items[sectionIndex].collection[0].exerciseCollection[index],
        };
        items[sectionIndex].collection[0].exerciseCollection[index] = item;
        setInformation(items);
      })
    );
    if (!props.previusIdentifiers.includes(title)) {
      let sectionToSave = information[sectionIndex];
      console.warn("section---", information[sectionIndex]);
      props.addItemToExerciseRoutine({ newExercise: sectionToSave, title });
    }
    setExistence(!exists);
  };

  const deleteMultimedia = async (uri) => {
    try {
      await FileSystem.deleteAsync(FileSystem.documentDirectory + uri);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteInformation = (sectionIndex, title) => {
    const urls = getUrls(
      props.ExerciseRoutine[sectionIndex].collection[0].exerciseCollection
    );
    urls.forEach(async (uri) => {
      const dlete = await deleteMultimedia(uri);
    });
    const urlsAudio = getAudioUrls(
      props.ExerciseRoutine[sectionIndex].collection[0].exerciseCollection
    );
    urlsAudio.forEach(async (uri) => {
      const dlete = await deleteMultimedia(uri);
    });
    props.deleteExercise(title);
    setExistence(!exists);
  };

  const FirstSection = (info, sectionIndex) => {
    let title = info.title1;
    let collection = info.collection;
    // console.log(
    //   collection,
    //   "5645f5adsf4sd5f4sda4ds5fds4a5f4sdf564654545454545454"
    // );

    let existsInDownloads = props.previusIdentifiers.includes(title);
    let pendingDownload = 0;

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
                            title
                          );
                        },
                      },
                    ],
                    { cancelable: false }
                  );
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
            ) : (!pending ? (
              <TouchableOpacity
                onPress={async () => {
                  //Alert.alert(title);
                  Alert.alert(
                    "Descargar " + title,
                    "¿Está seguro que quiere descargar " + title + "?",
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
              <View style={{flexDirection: "row"}}>
                <Text style={{ color: "rgba(52, 152, 219, 1)" }}>
                  Descargando
                </Text>
                <ActivityIndicator size="small" color="rgba(52, 152, 219, 1)" />
              </View>
            ))}
          </View>
        </View>

        <View>
          {collection.map((element, index) => (
            <SecondSection key={"sec2" + index} element={element} />
          ))}
        </View>
      </View>
    );
  };

  const SecondSection = ({ element }) => {
    let title2 = element.title2;
    let exerciseCollection = element.exerciseCollection;
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
     //console.warn("El item que llega al ejercicios es :", item);
    let exercise = item.item;
    let day = exercise.day;
    let time = exercise.time;
    let multimedia = exercise.multimedia;
    let materials = exercise.materials || false;
    let materialsBackground = materials
      ? "rgba(142, 255, 127 ,1)"
      : "rgba(255, 136, 110,1)";

    let key_e = item.index;

    // console.log(
    //   "Las props que tenemos hata aca son:::::::::::::::::",
    //   exercise.data
    // );

    return (
      <TouchableOpacity
        key={key_e + "e"}
        style={OverviewExerciseStyles.container}
        onPress={() =>
          props.props.navigation.navigate("IndividualExcercise", {
            data: exercise.data,
          })
        }
      >
        <View style={OverviewExerciseStyles.imageContainer}>
          <Image
            source={{ uri: multimedia }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 13,
            }}
          />
        </View>
        <View style={OverviewExerciseStyles.containerTexts}>
          <Text style={OverviewExerciseStyles.title}>{day}</Text>
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
    return <ActivityIndicator size="large" color="#00ff00" />;
  } else if (information.length !== 0) {
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
    width: vmin(24),
    height: vmin(44),
    // backgroundColor: "yellow",
    marginRight: vmin(2),
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
    fontSize: vmin(3),
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
