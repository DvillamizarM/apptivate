import * as React from "react";
import { Dispatch } from "redux";

import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { connect } from "react-redux";

import * as MyTypes from "../../redux/types/types";

import IconCheck from "react-native-vector-icons/FontAwesome";

import IconLoader from "react-native-vector-icons/FontAwesome";

import { Audio, Video, AVPlaybackStatus } from "expo-av";

// Iconos para la seccion de informacion
import Check from "react-native-vector-icons/FontAwesome";
import Repeat from "react-native-vector-icons/FontAwesome";
import Wathc from "react-native-vector-icons/Ionicons";
import Play from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

interface Props {
  exercise: object[];
  setup: object;
}
var { vmin } = require("react-native-expo-viewport-units");
class EjercicioInactivo extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  state = {
    info: [],
    setup: [],
    playing: false,
    imgLoading: false,
    display: "",
    video: null,
  };

  componentDidMount = async () => {
    console.warn("state gif---", this.state.info);
    console.log("Las props que tenemos en el nuevo son: ", this.props);
    this.setState({
      info: this.props.navigation.state.params.data,
      setup: this.props.navigation.state.params.setup,
    });
  };

  // _handleVideoRef = (component) => {
  //   this.setState({ imgLoading: true });
  //   new Promise(() => {
  //     const playbackObject = component;
  //   });
  //   playbackObject
  //     .then(() => {
  //       this.setState({ imgLoading: false });
  //     })
  //     .catch((err) => Alert.alert("No fue posible cargar la animación"));
  // };

  async handlePlaySound(audio) {
    this.setState({ playing: true });
    const { sound } = await Audio.Sound.createAsync({ uri: audio });

    new Promise((resolve, reject) => {
      console.log("Playing Sound");
      sound.playAsync();
      console.warn("then");
      setTimeout(() => {
        resolve("foo");
      }, 15000);
    })
      .then(() => {
        sound.unloadAsync();
        this.setState({ playing: false });
      })
      .catch((err) => {
        Alert.alert("No se cargo el audio correctamente.");
      });
  }
  render() {
    return (
      <View style={styles.containerCard}>
        <View style={styles.containerImage}>
          {
            this.state.info.gif && this.state.info.gif.includes("gif") ? (
              <Image
                source={{ uri: this.state.info.gif }}
                onLoad={() => {
                  console.warn("entered gif load start");
                  this.setState({ imgLoading: true, display: "hidden" });
                }}
                onLoadEnd={() => {
                  console.warn("entered gif load end");
                  this.setState({ imgLoading: false, display: "flex" });
                }}
                style={
                  this.state.imgLoading
                    ? {
                        width: "100%",
                        display: "none",
                        height: "100%",
                        resizeMode: "contain",
                      }
                    : {
                        width: "100%",
                        display: "flex",
                        height: "100%",
                        resizeMode: "contain",
                      }
                }
              />
            ) : (
              <Video
                source={{ uri: this.state.info.gif }}
                resizeMode="stretch"
                isLooping
                usePoster
                onPlaybackStatusUpdate={(status) => {
                  console.warn("status", status, "  ", this.state.info.gif);
                }}
                shouldPlay
                style={{ width: "100%", height: "100%" }}
              />
              // <Video
              //   source={{ uri: this.state.info.gif }}
              //   resizeMode="stretch"
              //   isLooping
              //   ref={this.state.video}
              //   shouldPlay
              //   onError={() => {
              //     const tempVideo = this.state.info.gif;
              //     this.state.video
              //       ? this.state.video.current.loadAsync(
              //           this.state.info.gif,
              //           (downloadFirst = true)
              //         )
              //       : Alert.alert("erro");
              //   }}
              //   usePoster
              //   onLoadStart={()=>{console.warn("heelooo")}}
              //   onPlaybackStatusUpdate={(status) => {
              //     console.warn("status", status, "  ", this.state.info.gif);
              //     status.isLoaded
              //       ? this.setState({ imgLoading: true, display: "hidden" })
              //       : Alert.alert("Error");
              //   }}
              //   style={
              //     this.state.imgLoading
              //       ? {
              //           width: "100%",
              //           display: "none",
              //           height: "100%",
              //         }
              //       : {
              //           width: "100%",
              //           display: "flex",
              //           height: "100%",
              //         }
              //   }
              // />
            )
            // (this.state.info.gif && this.state.info.gif.includes("gif")) ? (
            //     <Image
            //       source={{ uri: this.state.info.gif }}
            //       style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            //     />
            //   ) : (
            //     <Video
            //       source={{ uri: this.state.info.gif }}
            //       resizeMode="stretch"
            //       isLooping
            //       usePoster
            //       shouldPlay
            //       style={{ width: "100%", height: "100%" }}
            //     />
            //   )
          }
          {this.state.imgLoading ? (
            <ActivityIndicator size="large" color="#6979f8" />
          ) : (
            <View></View>
          )}
        </View>
        <View style={styles.containerButtons}>
          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Check name="check-square-o" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{}}>Series</Text>
              <Text style={{}}>
                {this.state.setup.series ? this.state.setup.series : "1"}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Repeat name="repeat" size={vmin(9)} color="#999999" />
            </View>

            <View style={styles.textContainer}>
              <Text style={{ fontSize: vmin(3.1) }}>Repeticiones</Text>
              <Text style={{}}>
                {this.state.setup.repeticiones
                  ? this.state.setup.repeticiones
                  : "1"}
              </Text>
            </View>
          </View>

          {/* <View style={styles.box}>
            <View style={styles.iconContainer}>
              <Wathc
                name="md-stopwatch-outline"
                size={vmin(9)}
                color="#999999"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={{}}>Tiempo</Text>
              <Text style={{}}>{this.state.info.activeTime || "1"}</Text>
            </View>
          </View> */}
          <TouchableOpacity
            style={styles.box}
            disabled={this.state.playing}
            onPress={() => {
              this.handlePlaySound(this.state.info.voz);
            }}
          >
            <View style={styles.iconContainer}>
              {this.state.playing ? (
                <ActivityIndicator size="large" color="#6979f8" />
              ) : (
                <AntDesign name="sound" size={vmin(9)} color="#999999" />
              )}
            </View>
            <View style={styles.textContainer}>
              <Text style={{}}>Comando</Text>
              <Text style={{}}>de Voz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.indicatorTextContainer}>
          <Text
            style={{
              fontSize: vmin(4),
              marginBottom: "2%",
              padding: 5,
              backgroundColor: "rgba(105,121,248,0.2)",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Descripción: </Text>{" "}
            {this.state.info.description}
          </Text>
          {this.state.info.materials != "" ? (
            <Text
              style={{
                fontSize: vmin(4),
                padding: 7,
                backgroundColor: "rgba(105,121,248,0.2)",
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Materiales: </Text>{" "}
              {this.state.info.materials}
            </Text>
          ) : (
            console.log("nothing")
          )}
        </View>
      </View>
    );
  }
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {};
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({});
export default connect(MapStateToProps, MapDispatchToProps)(EjercicioInactivo);

const styles = StyleSheet.create({
  containerCard: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  containerHeaderCard: {
    borderRadius: 10,
    height: "8%",
    flexDirection: "row",
    // backgroundColor: "pink",
  },
  headerLeftSection: {
    width: "10%",
    height: "100%",
    alignItems: "flex-end",
    // backgroundColor: "gray",
  },
  greenBall: {
    backgroundColor: "#00C48C",
  },
  headerCenterSection: {
    width: "75%",
    height: "100%",
    // backgroundColor: "orange",
  },
  textHeaderAlert: {
    fontSize: vmin(3),
    color: "#999999",
  },
  textHeaderExercise: {
    fontSize: vmin(4),
    color: "black",
    fontWeight: "bold",
  },
  textHeaderTime: {
    fontSize: vmin(4),
    color: "#999999",
  },
  headerRightSection: {
    width: "15%",
    height: "100%",
    flexDirection: "row",
    backgroundColor: "#6979F8",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    height: "55%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginBottom: "2%",
    //  backgroundColor: "pink",
  },
  indicatorTextContainer: {
    // backgroundColor: "rgba(105,121,248,0.2)",
    borderRadius: 10,
    height: "23%",
    width: "95%",
    justifyContent: "space-evenly",
    padding: vmin(1),
  },
  // footerSection: {
  //   backgroundColor: "black",
  //   height: "10%",
  //   width: "100%",
  //   justifyContent: "flex-start",
  //   alignItems: "center",
  //   flexDirection: "row",
  //   paddingLeft: vmin(10),
  // },
  textActiveTime: {
    fontSize: vmin(4),
    color: "#999999",
    padding: vmin(2),
  },
  greenSection: {
    backgroundColor: "#00C48C",
    borderRadius: 20,
    width: "20%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerButtons: {
    height: "18%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: "2%",
    // backgroundColor: "green",
  },

  box: {
    height: "90%",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },

  iconContainer: {
    height: "60%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "peru",
  },

  textContainer: {
    height: "40%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
