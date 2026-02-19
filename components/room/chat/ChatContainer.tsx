import { GlobalStyle } from "@/styles/global";
import { messageType } from "@/types/types";
import type { RootState } from "@/util/store";
import { useEffect, useRef } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";

export default function ChatContainer() {
  const messages = useSelector((state: RootState) => state.messages.messages);
  const user = useSelector((state: RootState) => state.user.user);
  const scrollRef = useRef<FlatList<messageType>|null>(null)

  useEffect(()=>{
    scrollRef.current?.scrollToEnd({animated:true})
  },[messages.length])

  return (
    <View style={styles.container}>
      <FlatList ref={scrollRef} data={messages} keyExtractor={(item) => item.id} contentContainerStyle={styles.content}
        renderItem={({ item }) => {
          const isMe = item.user.id === user?.id;

          return (
            <View style={[ styles.row, { justifyContent: isMe ? "flex-end" : "flex-start" }]} >
              {!isMe && (
                <View style={[ styles.avatar, { backgroundColor: item.user.hex_code }]}>
                  <Text style={styles.avatarText}>
                    {item.user.name.slice(0, 1)}
                  </Text>
                </View>
              )}
              <MessageBubble userId={user?.id} text={item} />
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    textTransform:"uppercase",
    color: "white",
    ...GlobalStyle.bold_button,
  },
});
