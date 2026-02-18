import SocketProvider from "@/components/SocketProvider";
import { colors } from "@/styles/global";
import store, { persistor } from "@/util/store";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";



export default function RootLayout() {
  SplashScreen.preventAutoHideAsync()
  const [fontsLoaded,error] = useFonts({
    "Poppins": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins_Semibold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins_Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins_Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  useEffect(()=>{
    if (error) throw error;
    if (fontsLoaded){
      SplashScreen.hideAsync();
    }
  },[error, fontsLoaded]);

   if (!fontsLoaded && !error) return null;


  return (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <SocketProvider>
        <Stack screenOptions={{ headerShown:false, contentStyle:{backgroundColor:colors.secondary}}}>
          <Stack.Screen name="login"/>
          <Stack.Screen name="room"/>
        </Stack>
        <Toast/>
        <StatusBar hidden={true}/>
      </SocketProvider>
    </PersistGate>
  </Provider>

)
}