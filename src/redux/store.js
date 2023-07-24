import {combineReducers} from "redux";
import {signUpInReducer} from "./slices/singUpIn.slice";
import {paidReducer} from "./slices/paid.slice";
import {adminReducer} from "./slices/admin.slice";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    signUpInReducer, paidReducer, adminReducer
});

const setupStore = () => configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});
const store = setupStore();

export {
    store,
    setupStore
}