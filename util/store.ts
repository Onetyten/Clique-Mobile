import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import messageReducer from "../store/messageSlice"
import roomReducer from "../store/roomSlice"
import sessionReducer from "../store/sessionSlice"
import userReducer from "../store/userSlice"

const persistConfig = {
    key:'root',
    version:1,
    storage:AsyncStorage,
    whitelist:["user","room","messages"]
}

const reducer = combineReducers({
    user: userReducer,
    room: roomReducer,
    messages: messageReducer,
    session:sessionReducer,
})

const persistedReducer = persistReducer(persistConfig,reducer)

const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    })
})

export default store
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch