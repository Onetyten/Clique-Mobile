/* eslint-disable react-hooks/exhaustive-deps */
import { RootState } from "@/util/store";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { useSelector } from "react-redux";

export default function Vignette() {
    const messages = useSelector((state:RootState)=>state.messages.messages)
    const user = useSelector((state: RootState) => state.user.user);
    const opacity = useSharedValue(0);


    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.type !== "wrong" || lastMessage.user.id !== user?.id) return;

        opacity.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) }, () => {
            opacity.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) });
        });
    }, [messages]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));


  return (
    <Animated.View style={[styles.vignetteWrapper, animatedStyle]} pointerEvents="none">
      <Svg width="100%" height="100%">
        <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="30%" stopColor="transparent" stopOpacity={0} />
                <Stop offset="90%" stopColor="red" stopOpacity={0.1} />
                <Stop offset="100%" stopColor="red" stopOpacity={0.1} />
            </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  vignetteWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
});
