/* eslint-disable react-hooks/exhaustive-deps */
import { colors } from "@/styles/global";
import type { userType } from "@/types/types";
import React, { useEffect } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import SidebarItem from "./SidebarItem";

interface PropType {
  friendList: userType[];
  sidebarOpened: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const screenWidth = Dimensions.get("window").width;
const sidebarWidth = screenWidth * 0.75;

export default function Sidebar({ friendList, sidebarOpened, setOpenSidebar}: PropType) {
  const translateX = useSharedValue(-sidebarWidth);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (sidebarOpened) {
      translateX.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    }

    else {
      translateX.value = withTiming(-sidebarWidth, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });

      overlayOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [sidebarOpened]);



  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  if (!sidebarOpened) return null;


  

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpenSidebar(false)}/>

      <Animated.View style={[styles.sidebar, sidebarStyle]}>
        <ScrollView contentContainerStyle={styles.content}>
          {friendList.map((item, index) => (
            <SidebarItem key={index} friend={item} sidebarOpened={sidebarOpened} />
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000060",
    zIndex: 50,
    justifyContent: "flex-start",
  },

  sidebar: {
    width: sidebarWidth,
    height: "100%",
    backgroundColor: colors.primary,
    padding: 24,
  },

  content: {
    paddingBottom: 40,
  },
});
