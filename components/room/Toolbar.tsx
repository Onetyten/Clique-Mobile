import { colors, GlobalStyle } from "@/styles/global";
import type { RootState } from "@/util/store";
import { PanelRight } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface PropType {
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  timeLeft: number;
}

export default function Toolbar({ setOpenSidebar, timeLeft }: PropType) {
  const room = useSelector((state: RootState) => state.room.room);
  const session = useSelector((state: RootState) => state.session.session);

  const getCountdownColor = () => {
    if (timeLeft < 10) return colors.danger;
    if (timeLeft < 20) return colors.warning;
    return colors.success;
  };


  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={() => setOpenSidebar((prev) => !prev)}>
          <PanelRight size={24} color={colors.text} />
        </TouchableOpacity>

        {!session ?
        ( <Text style={styles.roomName} numberOfLines={1}> {room?.name?.slice(0, 32)} </Text> ) 
        : 
        ( <Text style={styles.questionText}> {session.question} </Text> )}
      </View>

      {session && (
        <View style={[styles.countdown, { borderColor: getCountdownColor() }]}>
          <Text style={[styles.countdownText, { color: getCountdownColor() }]}>
            {timeLeft}s
          </Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop:32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.primary,
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },

  roomName: {
    ...GlobalStyle.semibold_button,
    color:colors.text,
    maxWidth: "80%",
  },

  questionText: {
    color: colors.text,
    flexShrink: 1,
  },

  countdown: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
  },

  countdownText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
