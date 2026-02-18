import { colors, GlobalStyle } from '@/styles/global'
import React, { useState } from 'react'
import { StyleSheet, TextInput } from 'react-native'

interface propType{
    value:string
    setValue:React.Dispatch<React.SetStateAction<string>>
    placeholder:string,
    isPassword?:boolean
}

const Input = ({value,setValue,placeholder,isPassword}:propType) => {
   const [focused, setFocused] = useState(false)
   
   

  return (
    <TextInput style={[styles.input,focused && styles.focusedInput,]} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholderTextColor={colors.muted} placeholder={placeholder} secureTextEntry={isPassword} value={value} onChangeText={setValue}/>
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
        height:56,
        color:colors.text,
        ...GlobalStyle.poppins_body,
    },
    focusedInput: {
        borderWidth: 2,
        borderColor: colors.muted,
    },
})