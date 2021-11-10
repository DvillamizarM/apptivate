import React, { useEffect } from "react";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createAppContainer } from "react-navigation";
import SwitchNavigator from "./src/navigation/CustomNavigation";
import reducer from "./src/redux/reducers/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaProvider } from "react-native-safe-area-context";
//import * as FileSystem from 'expo-file-system';
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import {
  TourGuideProvider, // Main provider
} from "rn-tourguide";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["Setting a timer"]); // ignore specific logs
// import NavigatorService from "./services/navigator.js";
// import tour from "./services/tour.js";
// import {
//   useTourGuideController, // hook to start, etc.
// } from "rn-tourguide";

//LogBox.ignoreLogs(["Setting a timer"]); // ignore specific logs

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);
const Navegador = createAppContainer(SwitchNavigator);

const checkAsync = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys, (error, stores) => {
      stores?.map((result, i, store) => {
        console.log("checkAsync------", [store[i][0]], store[i][1]);
        return true;
      });
    });
  });
};

const App = () => {
//   const { canStart, start, eventEmitter } = useTourGuideController();
//   const [step, setStep] = useState(0);
//  const handleOnStart = () => console.log("start");
//   const handleOnStepChange = (step) => {
//     // if (step.order === 6) {
//     //   setIndex(1)
//     // }
//     console.log(`stepChange`);
//   };
  const style = {
    borderRadius: 10,
  };

  // useEffect(() => {
  //   console.warn("use effect app 1")
  //   if (canStart && NavigatorService.getCurrentRoute() !== null) {
  //     console.warn("passed both state and navigator")
  //     start();
  //   }
  // }, [canStart, NavigatorService.getCurrentRoute()]); // we change this

  // useEffect(() => {
  //   console.warn("use effect app 2")
  //   // we add this hook
  //  // eventEmitter.on("stepChange", () => {});

  //  if(eventEmitter!== undefined){   
  //   eventEmitter.on("start", handleOnStart);
  //   eventEmitter.on('stepChange', step => {
  //     const s = step?step.order:0
  //        console.log(`tutorial step ${s}`);
  //        setStep(s)
  //   })
  //    eventEmitter.on("stop", () => {
  //     // // When the tour for that screen ends, navigate to the next screen if it exists.
  //     // const nextScreen = tour[NavigatorService.getCurrentRoute()];
  //     // if (nextScreen) {
  //     //   NavigatorService.navigate(nextScreen);
  //     // }
  //   });
  //   return () => eventEmitter.off("*", null);
  //  }
    
  // }, [eventEmitter]);

  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={checkAsync}
      >
        <SafeAreaProvider
          style={{
            flex: 1,
            backgroundColor: "white",
            width: "100%",
            height: "100%",
          }}
        >
          <TourGuideProvider
            androidStatusBarVisible={true}
            {...{ tooltipStyle: style }}
            {...{
              labels: {
                previous: "Anterior",
                next: "Siguiente",
                skip: "Omitir Guía",
                finish: "Terminar",
              },
            }}
          >
            <Navegador
              // ref={(navigatorRef) => {
              //   console.warn("ref---",navigatorRef)
              //   NavigatorService.setContainer(navigatorRef);
              // }}
            />
          </TourGuideProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
