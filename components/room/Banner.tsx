/* eslint-disable react-hooks/exhaustive-deps */
import { colors, GlobalStyle } from '@/styles/global'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming, } from 'react-native-reanimated'


interface propType{
  bannerMessage:string
}


const Banner = ({bannerMessage}:propType) => {
    const bgScale = useSharedValue(0)
    const textOpacity = useSharedValue(0);
    const textY = useSharedValue(30);

    useEffect(() => {
        bgScale.value = withTiming(1, {duration:300 ,easing:Easing.inOut(Easing.ease)})

        textOpacity.value = withDelay(300,withTiming(1, { duration:200,easing:Easing.inOut(Easing.ease) }))

        textY.value = withDelay(300,withTiming(0, { duration:200,easing:Easing.inOut(Easing.ease) }))

    },[]);

    const bgStyle = useAnimatedStyle(()=>({
        transform: [{scaleX:bgScale.value}]
    }))

    const textStyle = useAnimatedStyle(()=>({
        opacity:textOpacity.value,
        transform:[{translateY:textY.value}]
    }))

  return (
    <View style={style.parent}>
        <Animated.View style={[style.banner,bgStyle]}>
            <Animated.Text style={[{...GlobalStyle.bold_button,color:"#fff"},textStyle]}>{bannerMessage}</Animated.Text>
        </Animated.View>
    </View>
  )
}

export default Banner

const style = StyleSheet.create({
    parent:{
        position:"fixed",
        width:"100%",
        height:"100%",
        justifyContent:"center",
        alignItems:"center",
        zIndex:40,
        backgroundColor:colors.primary+"40"
    },
    banner:{
        padding:48,
        backgroundColor:colors.blurple,
        width:"100%",
        justifyContent:"center",
        alignItems:"center"
    },
})