import * as React from "react";
import {
  View,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ScalableText from "react-native-text";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

import GeneralInformation from "./GeneralInformation";

import ExerciseRoutine from "../cards/ExerciseRoutine";

import Limiting from "../cards/Limiting";

//const FirstRoute = (props) => <> </>;
const FirstRoute = (props) => <GeneralInformation props={props} />;

const SecondRoute = (props) => <Limiting props={props} />;

const ThirdRoute = (props) => <ExerciseRoutine props={props} />;

var { vmin } = require("react-native-expo-viewport-units");

function Repository(props) {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [activate, setActivation] = React.useState(true);
  const [routes] = React.useState([
    { key: "first", title: "General" },
    { key: "second", title: "Restricciones" },
    { key: "third", title: "Rutina de Ejercicios" },
  ]);

  const renderScene = SceneMap({
    first: () => FirstRoute(props),
    second: () => SecondRoute(props),
    third: () => ThirdRoute(props),
  });

  React.useEffect(()=>{
  // console.warn("repo useeffect-?!!!-");
    props.setRepoIndex(index);
    //setActivation

  },[index, props.showTour1, props.showTour2, props.showTour3])
 // console.warn("repo ====", props.repoIndex)
  return (
    <TabView
      navigationState={{ index, routes }}
      swipeEnabled={false}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width, height: layout.height }}
      // style={{ backgroundColor: "red", height: 20 }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          renderLabel={({ route, color }) => (
            <ScalableText
              style={{
                color: "#6979F8",
                margin: 4,
                fontSize: vmin(3.8),
                textAlign: "center",
              }}
            >
              {route.title}
            </ScalableText>
          )}
          indicatorStyle={{ backgroundColor: "#6979F8" }}
          style={{
            backgroundColor: "white",
            // alignItems: "center",
            // justifyContent: "center",
            // height:vmin(15)
          }}
        />
      )}
    />
  );
  // return (
  //   <View style={{ width: "100%", height: "100%" }}>
  //     <View
  //       style={{
  //         width: "100%",
  //         height: "8%",
  //         flexDirection: "row",
  //         backgroundColor: "white",
  //       }}
  //     >
  //       <TouchableOpacity
  //         style={{
  //           width: "33%",
  //           height: "100%",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //         onPress={() => setIndex(0)}
  //       >
  //         <Text>General</Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity
  //         style={{
  //           width: "33%",
  //           height: "100%",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //         onPress={() => setIndex(1)}
  //       >
  //         <Text>Rutina de Ejercicios</Text>
  //       </TouchableOpacity>

  //       <TouchableOpacity
  //         style={{
  //           width: "33%",
  //           height: "100%",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //         onPress={() => setIndex(2)}
  //       >
  //         <Text>Limitantes</Text>
  //       </TouchableOpacity>
  //     </View>

  //     <View style={{ width: "100%", height: "98%", flexDirection: "row" }}>
  //       {index == 0 ? (
  //         <GeneralInformation />
  //       ) : index == 1 ? (
  //         <ExerciseRoutine />
  //       ) : (
  //         <Limiting />
  //       )}
  //     </View>
  //   </View>
  // );
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  // console.warn("mappp-----", store.DownloadReducer.GeneralInfo);
  // console.warn("mappp ids-----", store.DownloadReducer.GeneralInfoIds);
  return {
    repoIndex: store.User.repoIndex,
    showTour1: store.User.showTour1,
    showTour2: store.User.showTour2,
    showTour3: store.User.showTour3,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setRepoIndex: (val) => dispatch(actionsUser.SET_REPOINDEX(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(Repository);
