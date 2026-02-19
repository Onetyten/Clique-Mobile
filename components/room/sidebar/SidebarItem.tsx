import { colors, GlobalStyle } from "@/styles/global";
import type { userType } from "@/types/types";
import { roleID } from "@/util/role";
import type { RootState } from "@/util/store";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

interface PropType {
  friend: userType;
  sidebarOpened: boolean;
}

export default function SidebarItem({ friend, sidebarOpened}: PropType) {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[ styles.avatar, { backgroundColor: friend.hex_code }]} >
            
          <Text style={styles.avatarText}>
            {friend.name.slice(0, 1)}
          </Text>

        </View>

        <View style={styles.info}>
            <Text style={styles.name}>{friend.name.slice(0,32)}</Text>
            <Text style={styles.score}> {friend.score || 0} pts </Text>
        </View>
      </View>

      {sidebarOpened && (
        <View style={styles.right}>
          {user && friend.id === user.id && <View style={styles.Badge} /> }

          {friend.role === roleID.admin && (
            <View style={styles.gmBadge}>
              <Text style={styles.gmText}>GM</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 48,
    aspectRatio:1,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "white",
    ...GlobalStyle.semibold_button,
    textTransform:"uppercase"
  },

  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
  },

  Badge: {
    width: 12,
    aspectRatio:1,
    borderRadius: 99,
    backgroundColor: colors.success,
  },

  adminBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.blurple,
    marginLeft: 4,
  },

  info: {
    justifyContent: "center",
  },

  name: {
    textTransform: "capitalize",
    color: colors.text,
    ...GlobalStyle.semibold_body
  },

  score: {
    color: colors.blurple,
    ...GlobalStyle.semibold_body
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  gmBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.blurple,
    borderRadius: 4,
  },

  gmText: {
    color: "white",
    fontSize: 12,
  },
});

