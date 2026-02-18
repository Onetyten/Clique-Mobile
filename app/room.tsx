import Banner from "@/components/room/Banner";
import ChatContainer from "@/components/room/chat/ChatContainer";
import Glow from "@/components/room/glow";
import MessageBar from "@/components/room/MessageBar";
import QuestionForm from "@/components/room/QuestionForm";
import Sidebar from "@/components/room/sidebar/Sidebar";
import Toolbar from "@/components/room/Toolbar";
import Vignette from "@/components/room/Vignette";
import useRoomSocketListeners from "@/hooks/useRoomSocketListeners";
import { colors } from "@/styles/global";
import { roleID } from "@/util/role";
import { RootState } from '@/util/store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const Room = () => {
    const user = useSelector((state:RootState)=>state.user.user)
    const session = useSelector((state:RootState)=>state.session.session)
    const [sidebarOpened,setOpenSidebar] = useState(false)
    const {friendList,setQuestionLoading,questionLoading,bannerMessage,triesLeft,setTriesLeft,showBanner,timeLeft,showQuestionForm,setShowQuestionForm} = useRoomSocketListeners()
    const isAdmin = user?.role === roleID.admin
    const [canAnswer,setCanAnswer] = useState(false)
    const [chatMode,setChatMode] = useState<"chat" | "answer">("chat")
    const role = user?.role
    const [showMessageLoader,setShowMessageLoader] = useState(false)


    useEffect(()=>{
        if (role === roleID.admin){
            setChatMode("chat")
        }
    },[role])

  return (
    <SafeAreaView style={styles.root} >

        {showBanner && <Banner bannerMessage={bannerMessage}/>}

        <View style={[styles.root,{position: "relative"}]} >
            <Toolbar timeLeft={timeLeft} setOpenSidebar={setOpenSidebar}/>
            {sidebarOpened && <Sidebar friendList={friendList} sidebarOpened={sidebarOpened} setOpenSidebar={setOpenSidebar}/>}

            <View style={styles.pulseWrapper} pointerEvents="none">
                <Glow size={360} timeLeft={timeLeft} />
            </View>

            <Vignette/>

            <ChatContainer/>

            <MessageBar setShowQuestionForm={setShowQuestionForm} showMessageLoader={showMessageLoader} setShowMessageLoader={setShowMessageLoader} triesLeft={triesLeft} setTriesLeft={setTriesLeft} isAdmin={isAdmin} canAnswer={canAnswer} setCanAnswer={setCanAnswer} chatMode={chatMode} setChatMode={setChatMode} />

            {showQuestionForm && user?.role === roleID.admin && session === null && <QuestionForm setQuestionLoading={setQuestionLoading} questionLoading={questionLoading} setShowQuestionForm={setShowQuestionForm}/>}
            
        </View>
    </SafeAreaView>
  )
}

export default Room


const styles = StyleSheet.create({
    root: {
        backgroundColor: colors.secondary,
        flex: 1,
        width: "100%",
    },
  
    pulseWrapper:{
        position: "absolute",
        inset:0,
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.2,
        zIndex: 0,
        overflow: "hidden",
    },

    glowCircle: {
        width: 300,
        aspectRatio:1,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 9999,
        backgroundColor:colors.blurple+"30"
    },

    pulseCircle:{
        width: "80%",
        aspectRatio:1,
        borderRadius: 9999,
        opacity: 0.8,
    },

    vignette: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        zIndex: 100,
        pointerEvents: "none",
    },
});
