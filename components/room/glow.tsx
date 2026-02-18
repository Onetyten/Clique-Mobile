/* eslint-disable react-hooks/exhaustive-deps */
import { colors } from "@/styles/global";
import { RootState } from "@/util/store";
import React, { useEffect } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { useSelector } from "react-redux";

type GlowProps = {
  size?: number;
  timeLeft: number;
};

export default function Glow({ size = 320, timeLeft }: GlowProps) {
    const session = useSelector((state:RootState)=>state.session.session)

    const getPulseColor = () => {
        if (!session) return colors.blurple;
        if (timeLeft < 10) return colors.danger;
        if (timeLeft < 20) return colors.warning;
        return colors.blurple;
    };

    const scale = useSharedValue(1)
    const opacity = useSharedValue(0.8)

    useEffect(()=>{
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1,{duration:800,easing:Easing.inOut(Easing.ease)}),
                withTiming(1,{duration:800,easing:Easing.inOut(Easing.ease)})
            ),-1
        )

        opacity.value = withRepeat(
            withSequence(
                withTiming(1,{duration:800,easing:Easing.inOut(Easing.ease)}),
                withTiming(0.8,{duration:800,easing:Easing.inOut(Easing.ease)})
            )
        )
    },[])

    const animatedStyle = useAnimatedStyle(()=>({
        transform:[{scale:scale.value}],
        opacity:opacity.value
    }))

  return (
    <Animated.View style={[{ width: size, height: size, alignItems: "center", justifyContent: "center" },animatedStyle]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%" >
            <Stop offset="20%" stopColor={getPulseColor()} stopOpacity={1} />
            <Stop offset="100%" stopColor={getPulseColor()} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#grad)" />
      </Svg>
    </Animated.View>
  );
}
