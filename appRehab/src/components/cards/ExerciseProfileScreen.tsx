import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";

var { vmin } = require("react-native-expo-viewport-units");

// redux

import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";

const ExerciseProfileScreen = () => {
  return (<View style={styles.container}>
<View style={styles.header}>

</View>

<View style={styles.body}>
<Text style={{fontSize: vmin(10), fontWeight: "bold", marginTop: "10%"}} >Bajo construcción</Text>
</View>

<View style={styles.footer}>

</View>

  </View>);
};

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    user: store.User.user,
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  setUser: (val) => dispatch(actionsUser.SET_USER(val)),
});
export default connect(
  MapStateToProps,
  MapDispatchToProps
)(ExerciseProfileScreen);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "orange",
  },

  header:{

  },

  body:{

  },

  footer:{
    
  }

});
