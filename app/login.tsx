import Input from "@/components/login/Input";
import useLoginSocketListeners from "@/hooks/useLoginSocketListeners";
import { colors, GlobalStyle } from "@/styles/global";
import { socket } from "@/util/socket";
import { useSocketContext } from "@/util/SocketContext";
import { toast } from "@/util/toast";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
    const [username,setUserName] = useState("")
    const [focused, setFocused] = useState<string | null>(null);
    const [cliqueName,setCliqueName] = useState("")
    const [cliqueKey,setCliqueKey] = useState("")
    const {loading,setLoading} = useSocketContext()
    useLoginSocketListeners(setLoading)

    async function HandleJoinRoom(){
        if (loading) return
        if (username.trim().length===0) return toast.warn(`Pls provide a name to join a clique`)
        if (cliqueKey.trim().length===0) return toast.warn(`Pls provide a key`)
        if (cliqueName.trim().length===0) return toast.warn(`Pls provide a Clique name`)
        setLoading(true)
        socket.emit("joinClique",{cliqueKey,username,cliqueName})
    }

    async function HandleCreateRoom(){
        if (loading) return
        if (username.trim().length===0) return toast.warn(`Pls provide a name to create a clique`)
        if (cliqueKey.trim().length===0) return toast.warn(`Pls provide a key`)
        if (cliqueName.trim().length===0) return toast.warn(`What do you want to name your Clique`)
        setLoading(true)
        socket.emit("CreateClique",{cliqueKey,username,cliqueName})
    }

  return (
    <View style={styles.background}>

        <View style = {styles.container}>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size={50} color={colors.text} />
                </View>
            )}

            <View  style={{width:"100%",gap:8,justifyContent:"center",alignItems:"center"}}>
              <Text style={styles.HeaderText}>Clique</Text>
              <Text style={styles.subHeaderText} >Join a Clique or start your own</Text>
            </View>

            <View  style={{width:"100%",gap:8,justifyContent:"center",alignItems:"center"}}>
              <Input value={username} setValue={setUserName} placeholder="Name"/>
              <Input value={cliqueName} setValue={setCliqueName} placeholder="Clique Name"/>
      
              <View style={{flexDirection:"row",width:"100%",gap:12,justifyContent:"center",alignItems:"center"}} className="flex w-full sm:w-sm gap-2">

                  <View style={{position:"relative",flex:1}}>
                    <Input value={cliqueKey} setValue={setCliqueKey} placeholder="# key" isPassword/>
                  </View>
                  
                  <TouchableOpacity style={{...styles.Button,backgroundColor:colors.blurple,width:"50%" }} onPress={HandleJoinRoom} >
                    <Text style={{color:"#fff", ...GlobalStyle.semibold_body,}}>Join Clique</Text>
                  </TouchableOpacity>
              </View>

              <TouchableOpacity disabled={loading} onPress={HandleCreateRoom} style={{...styles.Button,backgroundColor:colors.success,width:"100%" }}>
                <Text style={{color:colors.primary, ...GlobalStyle.semibold_body,}} >Create Clique</Text>
              </TouchableOpacity>
            </View>
            
        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  background:{
    backgroundColor:colors.secondary,
    height:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  container:{
    padding:20,
    paddingVertical:40,
    width:"83%",
    position:"relative",
    backgroundColor:colors.primary,
    borderRadius:4,
    alignItems:"center",
    justifyContent:"center",
    gap:20
  },
  loaderContainer:{
    position:"absolute",
    inset:0,
    zIndex:10,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:colors.secondary+"80"
  },
  HeaderText:{
    ...GlobalStyle.bold_h1,
    color:colors.text
  },
  subHeaderText:{
    ...GlobalStyle.semibold_body,
    color:colors.text
  },
  input:{
    // focus:outline-0 focus:border-2
    backgroundColor:colors.secondary,
    padding:16,
    borderRadius:4,
    borderColor:colors.muted,
    width:"100%",
    height:56,
    color:colors.text,
    ...GlobalStyle.poppins_body,
  },
  Button:{
    padding:14,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:4
  }

})