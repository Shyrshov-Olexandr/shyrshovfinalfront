import {axiosService} from "./axios.service";
import {urls} from "../configs";

const signUpInService = {
    signIn: async (signInData) => axiosService.post(urls.signUpIn.signIn, signInData)
};

export {signUpInService};