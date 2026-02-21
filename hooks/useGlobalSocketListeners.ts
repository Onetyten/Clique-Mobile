import { clearMessages } from "@/store/messageSlice"
import { clearRoom } from "@/store/roomSlice"
import { clearUser } from "@/store/userSlice"
import { toast } from "@/util/toast"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { socket } from "../util/socket"


export default function useGlobalSocketListeners(){
    const [authLoading,setAuthLoading] = useState(false)
    const [loading,setLoading] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        if (!socket.connected) socket.connect()
    
        socket.on("disconnect", (reason) => {
            if (reason === "io server disconnect") {
                socket.connect()
            }
        })
    
        socket.on("connect_error", (error) => {
            console.error("Connection error:", error)
        })

        socket.on("Error", (data) => {
            setAuthLoading(false)
            setLoading(false)
            toast.warn(data.message || "Please check your inputs");
        });

        socket.on("Boot Out",(data)=>{
            console.log(data)
            toast.warn(data.message || "Please, rejoin this room");
            dispatch(clearUser())
            dispatch(clearRoom())
            dispatch(clearMessages())
            setTimeout(() => {
                router.replace("/")
            }, 1500);
        })

        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("connect_error")
            socket.off("Error")
            socket.off("Boot Out")
            
        }
    },[])

    return {authLoading,loading,setAuthLoading,setLoading}
}
