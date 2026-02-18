import { colors } from "@/styles/global";
import type { RootState } from "@/util/store";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface PropType {
  timeLeft: number;
}

export default function QuestionBar({ timeLeft }: PropType) {
  const session = useSelector( (state: RootState) => state.session.session );
//   if (!session) return null;

  const getTimeColor = () => {
    if (timeLeft < 10) return colors.danger;
    if (timeLeft < 20) return colors.warning;
    return colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {session?.question}
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: getTimeColor() }]}>
          {timeLeft}s
        </Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary_200,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },

  questionContainer: {
    flex: 1,
  },

  questionText: {
    color: "white",
    fontSize: 14,
  },

  timerContainer: {
    padding: 12,
    borderRadius: 4,
  },

  timerText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
