import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import axios from "axios";
import {baseURL} from "../configs/urls";

let tokens = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

const axiosService = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${tokens?.access_token}`}
});


axiosService.interceptors.request.use(async config => {


    if (!tokens) {
        tokens = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
        config.headers.Authorization = `Bearer ${tokens?.access_token}`
    } else {
        const decoded = jwtDecode(tokens?.access_token);
        const refreshDecoded = jwtDecode(tokens?.refresh_token);
        const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;
        const refreshExpired = dayjs.unix(refreshDecoded.exp).diff(dayjs()) < 1

        if (refreshExpired) {
            window.location.href = '/getStarted'
        }


        if (config.headers.Authorization === 'Bearer undefined') {
            tokens = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
            config.headers.Authorization = `Bearer ${tokens.access_token}`
            return config
        }


        if (!isExpired) {
            return config
        } else {
            const response = await axios.post(baseURL + '/auth/refresh', {
                token: tokens.refresh_token
            });

            if (response.status === 400) {
                localStorage.removeItem('currentUser')
                return config
            }
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            config.headers.Authorization = `Bearer ${response?.data.access_token}`
        }
    }

    return config;

}, error => {
    console.log(error)

    return Promise.reject(error);
});

export {axiosService, tokens}