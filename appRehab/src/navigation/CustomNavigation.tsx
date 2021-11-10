import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { TouchableOpacity, Text, View, Image } from "react-native";
import InfoButton from "../components/Simple/infoButton";

import Home from "../components/screens/Home";
import Ejercicios from "../components/screens/Ejercicios";

import CustomizeRoutine from "../components/screens/CustomizeRoutine";

import EndRoutine from "../components/screens/EndRoutine";

import Login from "../components/screens/Login";

import UserRegister from "../components/screens/UserRegister";

import UpdatePatient from "../components/screens/UpdatePatient";

import TermsAndConditions from "../components/screens/TermsAndConditions";

import RestorePassword from "../components/screens/RestorePassword";

import RegisterPatient from "../components/screens/RegisterPatient";

import ProfileScreen from "../components/screens/ProfileScreen";

import GeneralInformation from "../components/screens/GeneralInformation";

import RegisterCompanion from "../components/screens/RegisterCompanion";

import RegisterPhysiotherapist from "../components/screens/RegisterPhysiotherapist";

import Repository from "../components/screens/Repository";

import ScheduleRoutines from "../components/screens/ScheduleRoutines";

import IndividualExcercise from "../components/cards/IndividualExcercise";

import HomePhysiotherapist from "../components/Physiotherapist/HomePhysiotherapist";

import UserTabs from "../components/Physiotherapist/UserTabs";

import SingleUserEvent from "../components/Physiotherapist/SingleUserEvent";

import UserEventList from "../components/Physiotherapist/UserEventList";
import ReportEvent from "../components/screens/ReportEvent";

import SatisfactionSurvey from "../components/screens/SatisfactionSurvey";

import RecordTrainingData from "../components/PublicUser/RecordTrainingData";

import ManageUserData from "../components/Administrator/ManageUserData";
import RoutineHistory from "../components/screens/RoutineHistory";
import Logo from "../components/Simple/Logo";
import UpdatePhysioData from "../components/Physiotherapist/UpdatePhysioData";
import UpdateCompanionInfo from "../components/companion/UpdateCompanionInfo";
import PatientProfileScreen from "../components/companion/PatientProfileScreen";
import PatientHistory from "../components/companion/PatientHistory";
import PatientEvent from "../components/companion/PatientEvent";
import UpdateInfo from "../components/PublicUser/UpdateInfo";

const stack = createStackNavigator(
  {
    Ejercicios: {
      screen: (navigation: any) => <Ejercicios {...navigation} />,
      navigationOptions: () => ({
        // title: `Rutina`,
        // headerShown: true,
        // headerLeft: () => null,
        headerShown: false,
      }),
    },

    Home: {
      screen: (navigation: any) => <Home {...navigation} />,
      navigationOptions: () => ({
        headerTitleAlign: `left`,
        
        title: `Apptivate`,
        headerLeft: () => (
          <View style={{ width: "100%"}}>
            <Logo/>
          </View>
        ),
        headerShown: true,
      }),
    },

    CustomizeRoutine: {
      screen: (navigation: any) => <CustomizeRoutine {...navigation} />,
      navigationOptions: () => ({
        title: `Editar intensidad y tiempo`,
        headerShown: true,
      }),
    },

    EndRoutine: {
      screen: (navigation: any) => <EndRoutine {...navigation} />,
      navigationOptions: () => ({
        title: `Finalizar Rutina`,
        headerShown: true,
      }),
    },

    Login: {
      screen: (navigation: any) => <Login {...navigation} />,
      navigationOptions: () => ({
        title: `Apptivate`,
        headerLeft: () => (
          <View style={{ width: "100%"}}>
            <Logo/>
          </View>
        ),
        headerShown: true,
      }),
    },

    UserRegister: {
      screen: (navigation: any) => <UserRegister {...navigation} />,
      navigationOptions: () => ({
        title: `Registro de Usuario`,
        headerShown: true,
      }),
    },

    UpdatePatient: {
      screen: (navigation: any) => <UpdatePatient {...navigation} />,
      navigationOptions: () => ({
        title: `Actualizar Usuario`,
        headerShown: false,
      }),
    },

    TermsAndConditions: {
      screen: (navigation: any) => <TermsAndConditions {...navigation} />,
      navigationOptions: () => ({
        title: `Terminos y Condiciones`,
        headerShown: true,
      }),
    },

    RestorePassword: {
      screen: (navigation: any) => <RestorePassword {...navigation} />,
      navigationOptions: () => ({
        title: `Recuperar Cuenta`,
        headerShown: true,
      }),
    },

    RegisterPatient: {
      screen: (navigation: any) => <RegisterPatient {...navigation} />,
      navigationOptions: () => ({
        title: `Conitnuar registro`,
        headerShown: true,
        headerLeft: () => null,
      }),
    },

    ProfileScreen: {
      screen: (navigation: any) => <ProfileScreen {...navigation} />,
      navigationOptions: () => ({
        title: `Rutina Personal`,
        headerShown: true,
      }),
    },
    
    PatientProfileScreen: {
      screen: (navigation: any) => <PatientProfileScreen {...navigation} />,
      navigationOptions: () => ({
        title: `Rutina Personal`,
        headerShown: true,
      }),
    },
    
    PatientHistory: {
      screen: (navigation: any) => <PatientHistory {...navigation} />,
      navigationOptions: () => ({
        title: `Historial de Usuario`,
        headerShown: true,
      }),
    },

    PatientEvent: {
      screen: (navigation: any) => <PatientEvent {...navigation} />,
      navigationOptions: () => ({
        title: `Reportar Evento`,
        headerShown: true,
      }),
    },

    GeneralInformation: {
      screen: (navigation: any) => <GeneralInformation {...navigation} />,
      navigationOptions: () => ({
        title: `Informacion General`,
        headerShown: true,
      }),
    },

    RegisterCompanion: {
      screen: (navigation: any) => <RegisterCompanion {...navigation} />,
      navigationOptions: () => ({
        title: `Registrar acompañante`,
        headerShown: true,
      }),
    },
    RegisterPhysiotherapist: {
      screen: (navigation: any) => <RegisterPhysiotherapist {...navigation} />,
      navigationOptions: () => ({
        title: `Registrar fisioterapeuta`,
        headerShown: true,
      }),
    },
    UpdatePhysioData: {
      screen: (navigation: any) => <UpdatePhysioData {...navigation} />,
      navigationOptions: () => ({
        title: `Editar Perfil`,
        headerShown: false,
      }),
    },
    UpdateCompanionInfo: {
      screen: (navigation: any) => <UpdateCompanionInfo {...navigation} />,
      navigationOptions: () => ({
        title: `Editar Perfil`,
        headerShown: false,
      }),
    },
    UpdateInfo: {
      screen: (navigation: any) => <UpdateInfo {...navigation} />,
      navigationOptions: () => ({
        title: `Editar Perfil`,
        headerShown: false,
      }),
    },
    Repository: {
      screen: (navigation: any) => <Repository {...navigation} />,
      navigationOptions: () => ({
        title: `Catálogo de Info`,
        headerShown: true,
        
        headerRight: () => (
          <View>
            <InfoButton />
          </View>
        ),
      }),
    },

    ScheduleRoutines: {
      screen: (navigation: any) => <ScheduleRoutines {...navigation} />,
      navigationOptions: () => ({
        title: `Programar Alarmas`,
        headerShown: true,
      }),
    },

    IndividualExcercise: {
      screen: (navigation: any) => <IndividualExcercise {...navigation} />,
      navigationOptions: () => ({
        title: `Ejercicio`,
        headerShown: true,
      }),
    },

    HomePhysiotherapist: {
      screen: (navigation: any) => <HomePhysiotherapist {...navigation} />,
      navigationOptions: () => ({
        title: `Apptivate`,
        headerLeft: () => (
          <View style={{ width: "100%"}}>
            <Logo/>
          </View>
        ),
        headerShown: true,
      }),
    },

    UserTabs: {
      screen: (navigation: any) => <UserTabs {...navigation} />,
      navigationOptions: () => ({
        title: `Información de Usuario`,
        headerShown: true,
      }),
    },

    RoutineHistory: {
      screen: (navigation: any) => <RoutineHistory {...navigation} />,
      navigationOptions: () => ({
        title: `Historial de Rutinas`,
        headerShown: true,
      }),
    },

    SingleUserEvent: {
      screen: (navigation: any) => <SingleUserEvent {...navigation} />,
      navigationOptions: () => ({
        title: `Evento de Usuario`,
        headerShown: true,
      }),
    },

    ReportEvent: {
      screen: (navigation: any) => <ReportEvent {...navigation} />,
      navigationOptions: () => ({
        title: `Reportar Evento`,
        headerShown: true,
      }),
    },

    UserEventList: {
      screen: (navigation: any) => <UserEventList {...navigation} />,
      navigationOptions: () => ({
        title: `Lista de eventos`,
        headerShown: true,
      }),
    },

    SatisfactionSurvey: {
      screen: (navigation: any) => <SatisfactionSurvey {...navigation} />,
      navigationOptions: () => ({
        title: `Cuestionario de satisfacción`,
        headerShown: true,
      }),
    },

    RecordTrainingData: {
      screen: (navigation: any) => <RecordTrainingData {...navigation} />,
      navigationOptions: () => ({
        title: `RecordTrainingData`,
        headerShown: true,
      }),
    },

    ManageUserData: {
      screen: (navigation: any) => <ManageUserData {...navigation} />,
      navigationOptions: () => ({
        title: `ManageUserData`,
        headerShown: true,
      }),
    },
  },
  {
    headerMode: "screen",
    initialRouteName: "Home",
    mode: "modal",
  }
);

export default stack;
