import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {adminService} from "../../services/admin.service";

const initialState = {
    usersArr: [],
    statisticsArr:[],
    userStatistics:[],
    registerData: [],
    recreatedActivationLink: null
}

const getAllUsers = createAsyncThunk('adminSlice/getAllUsers',

    async (_, {__}) => {

        try {
            const {data} = await adminService.getAllUsers()
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const getStatistics = createAsyncThunk('adminSlice/getStatistics',

    async (_, {__}) => {

        try {
            const {data} = await adminService.getStatistics()
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const getUserStatistics = createAsyncThunk('adminSlice/getUserStatistics',

    async (id, {__}) => {

        try {
            const {data} = await adminService.getUserStatistics(id)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const registerUser = createAsyncThunk('adminSlice/registerUser',

    async (inputData, {__}) => {

        try {
            const {data} = await adminService.registerUser(inputData)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const activateUser = createAsyncThunk('adminSlice/activateUser',

    async (inputData, {__}) => {

        try {
            const {data} = await adminService.activateUser(inputData)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const recreateActivationLink = createAsyncThunk('adminSlice/activateUser',

    async (id, {__}) => {

        try {
            const {data} = await adminService.recreateToken(id)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const deleteUser = createAsyncThunk('adminSlice/deleteUser',

    async (id, {__}) => {
        try {
            const {data} = await adminService.deleteUser(id)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const blockUser = createAsyncThunk('adminSlice/blockUser',

    async (id, {__}) => {

        try {
            const {data} = await adminService.blockUser(id)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });


const unblockUser = createAsyncThunk('adminSlice/unblockUser',

    async (id, {__}) => {

        try {
            const {data} = await adminService.unblockUser(id)
            return data;
        } catch (e) {
            e.rejectWithValue(e.response.data)
        }
    });

const adminSlice = createSlice({

    name: 'adminSlice',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.usersArr = action.payload
            })
            .addCase(getStatistics.fulfilled, (state, action) => {
                state.statisticsArr = action.payload
            })
            .addCase(getUserStatistics.fulfilled, (state, action) => {
                state.userStatistics = action.payload
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registerData = action.payload
                state.createUrl = true
            })
            .addCase(recreateActivationLink.fulfilled, (state, action) => {
                state.recreatedActivationLink = action.payload
            })
});

const {reducer: adminReducer} = adminSlice;

const adminActions = {
    getAllUsers,
    getStatistics,
    getUserStatistics,
    registerUser,
    activateUser,
    recreateActivationLink,
    deleteUser,
    blockUser,
    unblockUser
}

export {
    adminActions,
    adminReducer
}