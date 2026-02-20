import { messageType } from "@/types/types";
import { View,StyleSheet,Text } from "react-native";
import MessageBubble from "./MessageBubble";
import { GlobalStyle } from "@/styles/global";

interface propType{
    item:messageType;
    userId:string;
}

const MessageRender = ({item,userId}:propType)=>{
    const isMe = item.user.id === userId;
    return(
      <View style={[ styles.row, { justifyContent: isMe ? "flex-end" : "flex-start" }]} >
              {!isMe && (
                <View style={[ styles.avatar, { backgroundColor: item.user.hex_code }]}>
                  <Text style={styles.avatarText}>
                    {item.user.name.slice(0, 1)}
                  </Text>
                </View>
              )}
              <MessageBubble userId={userId} text={item} />
        </View>
    )
  }

  export default MessageRender


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
  