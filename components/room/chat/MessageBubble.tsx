/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-unresolved */
import { messageAnimated } from "@/store/messageSlice";
import { colors, GlobalStyle } from "@/styles/global";
import type { messageType } from "@/types/types";
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

  const translateY = useSharedValue(-40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (text.animated) return;

    dispatch(messageAnimated(text.id));

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
  },

  correct: {
    borderWidth: 2,
    borderColor: colors.success,
  },

  text: {
    color: "white",
    ...GlobalStyle.semibold_body
  },
});
