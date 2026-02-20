import { GlobalStyle } from "@/styles/global";
import { messageType } from "@/types/types";
import type { RootState } from "@/util/store";
import { useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import MessageRender from "./MessageRender";


export default function ChatContainer() {
  const messages = useSelector((state: RootState) => state.messages.messages);
  const user = useSelector((state: RootState) => state.user.user);
  const scrollRef = useRef<FlatList<messageType>|null>(null)
  const contentHeightRef = useRef(0);
  const containerHeightRef = useRef(0);



  useEffect(() => {
      const totalOffset = contentHeightRef.current - containerHeightRef.current;
      if (totalOffset > 0) {
          scrollRef.current?.scrollToOffset({ offset: totalOffset, animated: true });
      }
  }, [messages.length]);

  if (!user?.id) return

  return (
    <View style={styles.container}  onLayout={(e) => { containerHeightRef.current = e.nativeEvent.layout.height; }}>
      <FlatList ref={scrollRef} data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          onContentSizeChange={(_, h) => { contentHeightRef.current = h; }}
          renderItem={({item}) => <MessageRender item={item} userId={user.id} />}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          maxToRenderPerBatch={16}
          windowSize={11}
          updateCellsBatchingPeriod={16}
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
