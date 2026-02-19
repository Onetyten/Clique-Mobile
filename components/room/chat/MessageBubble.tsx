/* eslint-disable react-hooks/exhaustive-deps */
 
// import answerAudio from "@/assets/audio/answer-timeout.mp3";
import correctMessageAudio from "@/assets/audio/correct-message.mp3";
import messageReceiptAudio from "@/assets/audio/message-received.mp3";
import messageSentAudio from "@/assets/audio/message-sent.mp3";
import wrongMessageAudio from "@/assets/audio/wrong-answer.mp3";
import { messageAnimated } from "@/store/messageSlice";
import { colors, GlobalStyle } from "@/styles/global";
import type { messageType } from "@/types/types";
import { useAudioPlayer } from "expo-audio";
import { Zap } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useDispatch } from "react-redux";

interface PropType {
  userId: string | undefined;
  text: messageType;
}

export default function MessageBubble({userId, text}: PropType) {
  const dispatch = useDispatch();

  const isMe = text.user.id === userId;
  const isQuestion = text.type === "question" || text.type === "answer";
  const isWrong = text.type === "wrong";
  const isCorrect = text.type === "correct";
  const sentPlayer = useAudioPlayer(messageSentAudio);
  const receivedPlayer = useAudioPlayer(messageReceiptAudio);
  const wrongPlayer = useAudioPlayer(wrongMessageAudio)
  const correctPlayer = useAudioPlayer(correctMessageAudio)
  // const answerPlayer = useAudioPlayer(answerAudio)

  const translateY = useSharedValue(text.animated ? 0 : -40);
  const opacity = useSharedValue(text.animated ? 1 : 0);



  useEffect(() => {
    if (text.animated) return;
    dispatch(messageAnimated(text.id));
    if (text.type === "chat" ){
        if (isMe){
            sentPlayer.seekTo(0)
            sentPlayer.volume = 0.4
            sentPlayer.play()
        } 
        else{
            receivedPlayer.seekTo(0)
            receivedPlayer.volume = 0.4
            receivedPlayer.play()
        }
    }
    else if (text.type==="wrong"){
      wrongPlayer.seekTo(0)
      wrongPlayer.play()
    }
    else if (text.type === "correct"){
      correctPlayer.seekTo(0)
      correctPlayer.play()
    }
    else if (text.type === "answer"){
      correctPlayer.seekTo(0)
      correctPlayer.play()
    }

    opacity.value = withTiming(1, { duration: 250 });
    translateY.value = withTiming(0, { duration: 400 });
  }, []);



  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bubbleStyle = [
    styles.base,
    isMe ? styles.me : styles.other,
    isQuestion && styles.question,
    isWrong && styles.wrong,
    isCorrect && styles.correct,
  ];

  return (
    <Animated.View style={[bubbleStyle, animatedStyle]}>
      {isQuestion && (
        <Zap size={14} color="white" style={{ marginRight: 4 }} />
      )}
      <Text style={styles.text}>{text.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 14,
    maxWidth: "75%",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  me: {
    backgroundColor: colors.blurple,
    borderTopRightRadius: 0,
  },

  other: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 0,
  },

  question: {
    borderWidth: 2,
    borderColor: colors.blurple,
    backgroundColor: colors.primary,
  },

  wrong: {
    borderWidth: 2,
    borderColor: colors.danger,
    backgroundColor: colors.primary,
  },

  correct: {
    borderWidth: 2,
    borderColor: colors.success,
    backgroundColor: colors.primary,
  },

  text: {
    color: "white",
    ...GlobalStyle.semibold_body
  },
});
