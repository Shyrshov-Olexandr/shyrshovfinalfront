import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {signUpInService} from "../../services/singUpIn.service";

const initialState = {
    signInData: {},
    signUpData: {},
    error: false,
    blocked: false,
    redirect: false,
    errorCode: null

}

const signIn = createAsyncThunk('signInUpSlice/signIn',

    async (signInInputData, {_}) => {

        try {
            const {data} = await signUpInService.signIn(signInInputData)
            if (!data.is_blocked){
                localStorage.setItem('currentUser', JSON.stringify(data))
            }
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
            return e.rejectWithValue(e.response.data)
        }
    })

const signUpInSlice = createSlice({

    name: 'signUpInSlice',
    initialState,
    reducers: {
        setServerError: (state, action) => {
            //const {error_code} = action.payload.response;
            state.blocked = true;
        }
    },
    extraReducers: builder =>
        builder
            .addCase(signIn.fulfilled, (state, action) => {

                if (action.payload.is_blocked){
                    state.error = true
                    state.blocked = true
                }

                else {
                    state.error = false
                    state.signInData = action.payload
                    state.redirect = true
                }



            })
            .addCase(signIn.rejected, (state, action) => {
                state.error = true
                state.redirect = false
            })



});

const {reducer: signUpInReducer, actions:{setServerError} } = signUpInSlice;

const signUpInActions = {
    signIn, setServerError
}


export {
    signUpInActions,
    signUpInReducer,
}