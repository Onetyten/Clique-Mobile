/* eslint-disable react-hooks/exhaustive-deps */
import glitchSound from "@/assets/audio//glitch.mp3"
import pointObtainedAudio from "@/assets/audio//points-obtained.mp3"
import clockTickUrgent from "@/assets/audio/clock-ticking-urgent.mp3"
import clockTick from "@/assets/audio/clock-ticking.mp3"
import joinAudio from "@/assets/audio/join.mp3"
import bellAudio from "@/assets/audio/school_bell.mp3"
import { toast } from "@/util/toast"
import { useAudioPlayer } from 'expo-audio'
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addMessage, clearMessages, type newMessageType } from "../store/messageSlice"
import { clearRoom } from "../store/roomSlice"
import { clearSession, setSession } from "../store/sessionSlice"
import { clearUser, setUser } from "../store/userSlice"
import type { userType } from "../types/types"
import api from "../util/api"
import { socket } from "../util/socket"
import type { RootState } from "../util/store"
import store from "../util/store"


type FetchGuestsResponse = {
    members: userType[];
};


export default function useRoomSocketListeners(){
    const user = useSelector((state:RootState)=>state.user.user)
    const room  = useSelector((state:RootState)=>state.room.room)
    const session  = useSelector((state:RootState)=>state.session.session)
    const [friendList,setFriendList] = useState<userType[]>([])
    const [questionLoading,setQuestionLoading] = useState(false)
    const [showBanner,setShowBanner] = useState(false)
    const [showConfetti,setShowConfetti] = useState(false)
    const [roundCount,setRoundCount] = useState(1)
    const dispatch = useDispatch()
    const TOTAL_TRIES = 3
    const [triesLeft,setTriesLeft]  = useState(TOTAL_TRIES)
    const [timeLeft,setTimeleft] = useState<number>(60)
    const [bannerMessage,setBannerMessage] = useState(`Round ${roundCount} - Let’s Go!`)
    const [showQuestionForm,setShowQuestionForm] = useState(false)

    const joinPlayer = useAudioPlayer(joinAudio);
    const glitchPlayer = useAudioPlayer(glitchSound);
    const pointsPlayer = useAudioPlayer(pointObtainedAudio);
    const clockPlayer = useAudioPlayer(clockTick);
    const clockUrgentPlayer = useAudioPlayer(clockTickUrgent);
    const bellPlayer = useAudioPlayer(bellAudio);


    async function sessionCleanUp() {
        setTriesLeft(TOTAL_TRIES)
        setShowQuestionForm(false)
        setQuestionLoading(false)
    }

    async function getFriendList () {
        const room = store.getState().room.room
        const user = store.getState().user.user
        if (!room || !user) return
        try {
            const res = await api.get<FetchGuestsResponse>(`/room/guests/fetch/${encodeURIComponent(room.id)}`)
            const data = res.data
            if (data.members.length>0){ setFriendList(data.members) }
            const newUser = data.members.find(member=>member.id === user.id)
            if (!newUser) return
            dispatch(setUser(newUser))
            return
        } 
        catch (error) {
            console.log('error fetching members',error)
        }
    }

    useEffect(()=>{
        if (!user || !room){
            dispatch(clearUser())
            dispatch(clearRoom())
            dispatch(clearMessages())
            toast.warn("Please, rejoin this room");
            router.replace("/")   
        }
    },[room])

    useEffect(() => {
        if (!showBanner) return;
        const timeout = setTimeout(() => {
            setShowBanner(false);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [showBanner]);

    useEffect(() => {
        if (!showConfetti) return;
        const timeout = setTimeout(() => {
            setShowConfetti(false);
        }, 6000);

        return () => clearTimeout(timeout);
    }, [showConfetti]);

    useEffect(()=>{
        getFriendList()
    },[])

    useEffect(() => {
        clockPlayer.loop = true;
        clockPlayer.volume = 0.4;
        clockUrgentPlayer.loop = true;
        clockUrgentPlayer.volume = 0.6;
        bellPlayer.volume = 0.8;
    }, []);

    useEffect(() => {
        if (!session) return;
        setTimeleft(59);
        clockPlayer.seekTo(0);
        clockPlayer.play();

        const interval = setInterval(() => {
            setTimeleft(prev => {
                if (prev === 10) {
                    clockPlayer.pause();
                    clockUrgentPlayer.seekTo(0);
                    clockUrgentPlayer.play();
                }

                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clockPlayer.pause();
            clockUrgentPlayer.pause();
        };
    }, [session]);

    useEffect(() => {
        if (timeLeft !== 0 || !session) return;
        clockPlayer.pause();
        clockUrgentPlayer.pause();
        clockUrgentPlayer.seekTo(0);
        bellPlayer.seekTo(0);
        bellPlayer.play();
        dispatch(clearSession());
        setBannerMessage("Time's Up");
        setShowBanner(true);
    }, [timeLeft]);
    


    useEffect(()=>{
        const validateToken = () => {
            const room = store.getState().room.room
            const user = store.getState().user.user
            // console.log(user,room)
            if (room && user && room.token) {
                socket.emit("validateToken", { cliqueName: room.name, username: user.name, token: room.token})
            }
        }

        validateToken()
        socket.on("reconnect", validateToken)
        

        const handleUserJoined = (data: any) => {
            joinPlayer.seekTo(0)
            joinPlayer.play()
            toast.info(data.message)
            getFriendList()
        }
        socket.on("userJoined", handleUserJoined)
        socket.on("adminAssignment", handleUserJoined)

        const handleUserLeft = (data: any) => {
            glitchPlayer.seekTo(0)
            glitchPlayer.play()
            toast.info(data.message)
            getFriendList()
        }
        socket.on("userLeft", handleUserLeft)
        

        const handleMessageSent = (data: any) => {
            const newMessage: newMessageType = data
            dispatch(addMessage(newMessage))
        }
        socket.on("messageSent", handleMessageSent)

        const handleQuestionError = (data: any) => {
            dispatch(clearSession())
            setQuestionLoading(false)
            toast.warn(data.message)
        }
        socket.on("questionError", handleQuestionError)

        const handleQuestionAsked = (data: any) => {
            setTimeleft(59)
            sessionCleanUp()
            dispatch(setSession(data.session))
            setRoundCount(data.roundNum)
            setBannerMessage(`Round ${data.roundNum} - Let’s Go!`)
            setShowBanner(true)
        }
        socket.on("questionAsked", handleQuestionAsked)

        const handleTimeoutHandled = (data: any) => {
            sessionCleanUp()
            dispatch(clearSession())
            toast.info(data.adminMessage)
            getFriendList()
        }
         socket.on("timeoutHandled", handleTimeoutHandled)

        const handleAnswerCorrect = (data: any) => {
            const user = store.getState().user.user
            sessionCleanUp()
            dispatch(clearSession())
            getFriendList()
            toast.info(data.adminMessage)
            setBannerMessage(data.message)
            setShowBanner(true)
            pointsPlayer.seekTo(0)
            pointsPlayer.play()

            if (data.correctUser.id === user?.id){
                setShowConfetti(true)
            }
        }

        socket.on("answerCorrect", handleAnswerCorrect)

        const handleGameTimeSync = (data: any) => {
            const currentSession = store.getState().session.session
            if (!currentSession || (currentSession.id !== data.sessionId)) return
            setTimeleft(data.timeRemaining)
        }
        socket.on("gameTimeSync", handleGameTimeSync)        
        
        return () => {
            socket.off("reconnect", validateToken)
            socket.off("userJoined", handleUserJoined)
            socket.off("userLeft", handleUserLeft)
            socket.off("adminAssignment", handleUserJoined)
            socket.off("messageSent", handleMessageSent)
            socket.off("questionError", handleQuestionError)
            socket.off("questionAsked", handleQuestionAsked)
            socket.off("timeoutHandled", handleTimeoutHandled)
            socket.off("gameTimeSync", handleGameTimeSync)
            socket.off("answerCorrect", handleAnswerCorrect)
        }
    }, [dispatch])

    return{friendList,setQuestionLoading,questionLoading,roundCount,bannerMessage,showBanner,timeLeft,showQuestionForm,setShowQuestionForm,triesLeft,setTriesLeft,showConfetti}
}