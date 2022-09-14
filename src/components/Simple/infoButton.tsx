import * as React from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import * as MyTypes from "../../redux/types/types";
import { actionsUser } from "../../redux/actions/actionsUser";
import Icon from "react-native-vector-icons/FontAwesome";

function infoButton(props) {
  if(props.user.role === "physiotherapist"){
    return (
      <View
        style={{
          height: 50,
          width: 50,
          justifyContent: "center",
          alignItems:"center",
        }}
        
      >
        <TouchableOpacity
          style={{
            height: "80%",
            width: "80%",
            backgroundColor: "rgba(225, 126, 62,1)",
            borderRadius: 5,
            justifyContent: "center",
            alignItems:"center",
            marginLeft: "5%",
            marginRight: "15%",
          }}
        >
          <Icon
            name={"info-circle"}
            style={{ textAlign: "center" }}
            onPress={() => {
              switch (props.repoIndex) {
                case 0:
                  props.updateShowTour1(true);
                  break;
                case 1:
                  props.updateShowTour2(true);
                  break;
                case 2:
                  props.updateShowTour3(true);
                  break;
  
                default:
                  break;
              }
            }}
            color={"#ffffff"}
            // backgroundColor={'rgba(255, 231, 35,1.3)'}
            // borderRadius={13}
            size={24}
            //  style={{ height: "100%", width: "130%", marginLeft: "10%" }}
            // style={{paddingLeft:"20%"}}
            // style={{marginLeft:"5%",height: "100%", width: "100%",textAlign: "center", textAlignVertical: "center", backgroundColor: "rgba(225, 126, 62,1)",}}
          />
        </TouchableOpacity>
  
        {/* </TouchableOpacity> */}
      </View>
    );
  }else{
    return(<View></View>)
  }

  
}

const MapStateToProps = (store: MyTypes.ReducerState) => {
  return {
    repoIndex: store.User.repoIndex,
    user: store.User.user
  };
};

const MapDispatchToProps = (dispatch: Dispatch, store: any) => ({
  updateShowTour1: (val) => dispatch(actionsUser.SHOW_TOUR1(val)),
  updateShowTour2: (val) => dispatch(actionsUser.SHOW_TOUR2(val)),
  updateShowTour3: (val) => dispatch(actionsUser.SHOW_TOUR3(val)),
  updateShowTour4: (val) => dispatch(actionsUser.SHOW_TOUR4(val)),
  updateShowTour5: (val) => dispatch(actionsUser.SHOW_TOUR5(val)),
});
export default connect(MapStateToProps, MapDispatchToProps)(infoButton);
