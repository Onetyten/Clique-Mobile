/* eslint-disable import/no-unresolved */
import { addMessage, type newMessageType } from "@/store/messageSlice";
import { colors, GlobalStyle } from "@/styles/global";
import { roleID } from "@/util/role";
import { socket } from "@/util/socket";
import type { RootState } from "@/util/store";
import { toast } from "@/util/toast";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

interface PropType {
  setShowQuestionForm: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestionLoading: React.Dispatch<React.SetStateAction<boolean>>;
  questionLoading: boolean;
}

export default function QuestionForm({ setShowQuestionForm, questionLoading, setQuestionLoading }: PropType) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const session = useSelector((state: RootState) => state.session.session);
  const dispatch = useDispatch();

  const askQuestion = () => {
    if (!user) return;
    if (session !== null) return toast.warn("You cannot ask another question until this session is over");
    if (user.role !== roleID.admin) return toast.warn("Only game masters can ask questions");

    if (question.trim().length === 0) return toast.warn("Please provide a question");
    if (answer.trim().length === 0) return toast.warn("Please provide an answer");
    if (question.length > 256) return toast.warn("Question must be less than 256 characters");
    if (answer.length > 32) return toast.warn("Answer must be less than 32 characters");

    const payload = { user, question, answer, endTime: Date.now() + 60 * 1000 };
    const messagePayload = { user, message: question, timeStamp: Date.now() };
    const newMessage: newMessageType = { ...messagePayload, type: "question" };
    dispatch(addMessage(newMessage));
    socket.emit("askQuestion", payload);
    setQuestionLoading(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.overlay} >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowQuestionForm(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={styles.modal}>
          <Text style={[GlobalStyle.bold_h2, styles.title]}>Question</Text>

          {questionLoading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingTextContainer}>
                <Text style={[GlobalStyle.poppins_body, { color: colors.text }]}>
                  Question: <Text style={{ color: colors.text }}>{question}</Text>
                </Text>
                <Text style={[GlobalStyle.poppins_body, { color: colors.text }]}>
                  Answer: <Text style={{ color: colors.text }}>{answer}</Text>
                </Text>
              </View>
              <ActivityIndicator size="large" color={colors.blurple} />
            </View>
          ) : (
            <View style={{ width: "100%" }}>
              <TextInput placeholder="Question" value={question} onChangeText={setQuestion} multiline style={[styles.textInput, { minHeight: 80, maxHeight: 150 }]} placeholderTextColor={colors.muted} />

              <TextInput placeholder="Answer" value={answer} onChangeText={setAnswer} style={[styles.textInput, { height: 56 }]} placeholderTextColor={colors.muted} />

              <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={askQuestion} disabled={questionLoading} style={[styles.button, { backgroundColor: colors.success }]} >
                    <Text style={[GlobalStyle.bold_body, { color: colors.success }]}>Ask</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowQuestionForm(false)} style={[styles.button, { backgroundColor: colors.danger }]}>
                  <Text style={[GlobalStyle.bold_body, { color: colors.danger }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.primary + "AA", // semi-transparent
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  modal: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 6,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    gap: 16,
  },

  title: {
    fontSize: 28,
    marginBottom: 12,
    color: colors.text,
  },

  textInput: {
    backgroundColor: colors.secondary_200,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.muted,
    color: colors.text,
    fontSize: 16,
    marginBottom: 12,
    width: "100%",
  },

  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },

  button: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingContainer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },

  loadingTextContainer: {
    gap: 8,
    width: "100%",
  },
});
