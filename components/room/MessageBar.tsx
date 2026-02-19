
import { addMessage, newMessageType } from "@/store/messageSlice";
import { colors, GlobalStyle } from "@/styles/global";
import { socket } from "@/util/socket";
import type { RootState } from "@/util/store";
import { toast } from "@/util/toast";
import { Audio } from "expo-av";
import { MessageSquare, Mic, Send, Zap } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Input from "./Input";

interface PropType {
  isAdmin: boolean;
  chatMode: "chat" | "answer";
  canAnswer: boolean;
  triesLeft: number;
  setTriesLeft: React.Dispatch<React.SetStateAction<number>>;
  setCanAnswer: React.Dispatch<React.SetStateAction<boolean>>;
  setChatMode: React.Dispatch<React.SetStateAction<"chat" | "answer">>;
  showMessageLoader: boolean;
  setShowMessageLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setShowQuestionForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MessageBar({ isAdmin,setChatMode,chatMode,setShowMessageLoader,setShowQuestionForm,triesLeft,setTriesLeft}: PropType) {
  const [message, setMessage] = useState("");
  const user = useSelector((state: RootState) => state.user.user);
  const session = useSelector((state: RootState) => state.session.session);
  const dispatch = useDispatch();
  const glitchSound = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    (async () => {
      const { sound } = await Audio.Sound.createAsync( require("@/assets/audio/glitch.mp3") )
      glitchSound.current = sound;
    })();

    return () => {
      glitchSound.current?.unloadAsync();
    };
  }, []);

  const playGlitch = async () => {
    await glitchSound.current?.replayAsync();
  };


  function chatMessage() {
    if (!user) return;
    const { score, ...sender } = user;
    const payload = {
      user: sender,
      message,
      timeStamp: Date.now(),
    };

    const newMessage: newMessageType = { ...payload, type: "chat" };
    dispatch(addMessage(newMessage));
    socket.emit("ChatMessage", payload);
    setShowMessageLoader(true);
  }

  async function answerMessage() {
    if (!user) return;

    if (!session) {
      setChatMode("chat");
      await playGlitch();
      toast.info("Please wait until the game starts");
      return;
    }

    if (triesLeft <= 0) {
      await playGlitch();
      toast.warn("You have used up your attempts");
      return;
    }
    const newTries = triesLeft - 1;
    setTriesLeft(newTries);

    const payload = {
      currentSession: session,
      user,
      answer: message,
      timeStamp: Date.now(),
    };

    socket.emit("questionAnswered", payload);
    const { score, ...sender } = user;
    const messagePayload = {
      user: sender,
      message,
      timeStamp: Date.now(),
    };

    if (message.toLowerCase().trim() === session.answer.toLowerCase().trim()) {
      dispatch(addMessage({ ...messagePayload, type: "correct" }));
    }
    else {
      dispatch(addMessage({ ...messagePayload, type: "wrong" }));
      if (newTries > 0) toast.warn( `You have ${newTries} attempt${newTries > 1 ? "s" : ""}`)
    }
  }

  function submitMessage() {
    if (message.trim().length === 0) return;
    if (chatMode === "chat") chatMessage();
    else answerMessage();
    setMessage("");
  }

  return (
    <View style={styles.container}>

      <View style={styles.modeRow}>
        <View style={styles.modeLeft}>
          <TouchableOpacity style={styles.modeItem}onPress={() => setChatMode("chat")}>
            <MessageSquare size={20} color={ chatMode === "chat"? colors.blurple : colors.muted } />
            <Text style={[ GlobalStyle.semibold_small, {color:chatMode === "chat" ? colors.blurple : colors.muted} ]}>
              Chat mode
            </Text>
          </TouchableOpacity>

          {!isAdmin && (
            <TouchableOpacity style={styles.modeItem} onPress={() => setChatMode("answer")} >
              <Mic size={20} color={chatMode === "answer"? colors.blurple : colors.muted } />
              <Text style={[ GlobalStyle.semibold_small, { color: chatMode === "answer" ? colors.blurple : colors.muted} ]} >
                Answer mode
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isAdmin && session && (
          <View style={styles.zapContainer}>
            {Array.from({ length: triesLeft }).map((_, i) => <Zap key={i} size={18} color="#fff" /> )}
          </View>
        )}

        {isAdmin && !session && (
            <TouchableOpacity style={styles.newQuestion} onPress={() => setShowQuestionForm(true)} >
                <Zap size={18} color={colors.blurple} />
                <Text style={[ GlobalStyle.semibold_small,{ color: colors.blurple },]}>
                New question
                </Text>
            </TouchableOpacity>
            )}
        </View>

        <View style={styles.inputWrapper}>
            <Input value={message} setValue={setMessage} placeholder="Type a message" />

            {message.trim().length > 0 && (
            <TouchableOpacity style={styles.sendButton} onPress={submitMessage} >
                <Send size={22} color={colors.blurple} />
            </TouchableOpacity>
            )}
        </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },

  modeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modeLeft: {
    flexDirection: "row",
    gap: 16,
  },

  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  zapContainer: {
    flexDirection: "row",
    gap: 4,
  },

  newQuestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  inputWrapper: {
    position: "relative",
  },

  input: {
    backgroundColor: colors.secondary_200,
    padding: 16,
    borderRadius: 4,
    color: colors.text,
    height: 48,
  },

  sendButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -11 }],
  },
});