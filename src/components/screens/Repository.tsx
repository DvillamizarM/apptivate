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
import * as FileSystem from "expo-file-system";


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
  const mounted = React.useRef(false);
  //EXERCISE ROUTINE CACHER
  const [protocols, setProtocols] = React.useState({});

  const [index, setIndex] = React.useState(0);
  const [activate, setActivation] = React.useState(true);

  const [routes] = React.useState([
    { key: "first", title: "General" },
    { key: "second", title: "Restricciones" },
    { key: "third", title: "Ejercicios" },
  ]);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <GeneralInformation props={props} />;
      case "second":
        return <Limiting props={props} />;
      case "third":
        return (
          <ExerciseRoutine
            props={props}
            mounted= {mounted}
            protocols={protocols}
            setProtocols={setProtocols}
          />
        );
      default:
        return null;
    }
  };


  React.useEffect(() => {
    props.setRepoIndex(index);
  }, [index]);
  
  return (
    <TabView
      navigationState={{ index, routes }}
      swipeEnabled={false}
      renderScene={renderScene}
      onIndexChange={setIndex}
      lazy
      initialLayout={{ width: layout.width, height: layout.height }}
      // style={{ backgroundColor: "red", height: 20 }}
      renderTabBar={(props) => (
        <TabBar
          {...props}

          renderLabel={({ route, color }) => (
            <ScalableText
              style={{
                color: "#6979F8",
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
            height:vmin(12)
          }}
        />
      )}
    />
  );
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
