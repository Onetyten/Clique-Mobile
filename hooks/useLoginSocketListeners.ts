import { RootState } from "@/util/store"
import { toast } from "@/util/toast"
import { router } from "expo-router"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setRoom } from "../store/roomSlice"
import { setUser } from "../store/userSlice"
import type { loginDataType } from "../types/types"
import { socket } from "../util/socket"


export default function useLoginSocketListeners(setLoading:React.Dispatch<React.SetStateAction<boolean>>){
    const dispatch = useDispatch()
    const user= useSelector((state:RootState)=>state.user.user)
    const room= useSelector((state:RootState)=>state.room.room)

    function handleLogin(data:loginDataType){
        if (!data) return
        setLoading(false)
        dispatch(setUser(data.user))
        dispatch(setRoom(data.room))
        toast.success(data.message);
        router.replace("/room")
    }

    
    useEffect(()=>{
        // dispatch(clearMessages())
        // dispatch(clearRoom())
        // dispatch(clearUser())
    })


    useEffect(()=>{
        if (!socket.connected) socket.connect()
        socket.on("CliqueCreated", handleLogin);

        socket.on("JoinedClique", handleLogin);

        socket.on("midSessionError", (data) => {
            setLoading(false)
            toast.warn(data.message || "A session is currently going on in the clique");
            setTimeout(()=>{
                toast.success("Previous game session is over, you can join clique now")
            },data.timeLeft*1000)
        });

        return () => {
            socket.off("CliqueCreated", handleLogin)
            socket.off("JoinedClique", handleLogin)
            socket.off("midSessionError")
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

}