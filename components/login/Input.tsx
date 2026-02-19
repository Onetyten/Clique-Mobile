import { colors, GlobalStyle } from '@/styles/global'
import React, { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

interface propType{
    value:string
    setValue:React.Dispatch<React.SetStateAction<string>>
    placeholder:string,
    isPassword?:boolean
    multiline?:boolean
}

const Input = ({value,setValue,placeholder,isPassword,multiline}:propType) => {
   const [focused, setFocused] = useState(false)
   
   

  return (
    <TextInput style={[styles.input,{height:multiline?250:56,},focused && styles.focusedInput,]} multiline={multiline} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholderTextColor={colors.muted} placeholder={placeholder} secureTextEntry={isPassword} value={value} onChangeText={setValue}/>
  )
}

export default Input


const styles = StyleSheet.create({
    input:{
        backgroundColor:colors.secondary,
        padding:16,
        borderRadius:4,
        borderColor:colors.muted,
        width:"100%",
        color:colors.text,
        ...GlobalStyle.poppins_body,
    },
    focusedInput: {
        borderWidth: 2,
        borderColor: colors.muted,
    },
})