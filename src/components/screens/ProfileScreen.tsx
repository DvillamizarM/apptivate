import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import ScalableText from "react-native-text"

import GeneralProfileScreen from "../cards/GeneralProfileScreen";
import ChargeScreen from "../Simple/ChargeScreen";

const FirstRoute = (props) => <GeneralProfileScreen props={props} />;
var { vmin } = require("react-native-expo-viewport-units");

//const SecondRoute = (props) => <ExerciseProfileScreen props={props} />;

function TabViewExample(props) {
  const layout = useWindowDimensions();
const name = props.user.information.personal.name;
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [routes] = React.useState([
    { key: "first", title: "General", color: "red" },
   // { key: "second", title: "Programar rutinas" },
  ]);

  const renderScene = SceneMap({
    first: () => FirstRoute(props),
   // second: () => SecondRoute(props),
  });


  React.useEffect(() => {
    if (props.user !== undefined) {
      setLoading(false);
     }
   }, [loading]);
   
   if (loading) {
    return (
      <View
        style={{
          backgroundColor: "#ffffff",
          justifyContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <ChargeScreen />
      </View>
    );
  } 
  return (
    <TabView
      navigationState={{ index, routes }}
      swipeEnabled={false}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      //   style={{ backgroundColor: "red" }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          renderLabel={({ route, color }) => (
            <ScalableText style={{ color: "#6979F8", margin: 4, fontSize: vmin(4.5), textAlign: "center" }}>
              {name}
            </ScalableText>
          )}
          indicatorStyle={{ backgroundColor: "#6979F8" }}
          style={{
            backgroundColor: "white",
            // alignItems: "center",
            // justifyContent: "center",
          }}
        />
      )}
    />
  );
}


const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(TabViewExample);
