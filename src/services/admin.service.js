import {axiosService} from "./axios.service";
import {urls} from "../configs/urls";

let url = window.location.pathname;

let activateToken = url.replace('/admin/activate/', '')

const adminService = {
    getAllUsers: () => axiosService.get(urls.forAdmin.getAllUsers),
    registerUser: async (inputData) => axiosService.post(urls.forAdmin.userRegister, inputData),
    activateUser: async (inputData) => axiosService.post(urls.forAdmin.userActivate + "/" + activateToken, inputData),
    recreateToken: async (id) => axiosService.post(urls.forAdmin.recreateToken + "/" + id),
    deleteUser: async (id) => axiosService.post(urls.forAdmin.deleteUser + "/" + id),
    blockUser: async (id) => axiosService.patch(urls.forAdmin.blockUser + "/" + id),
    unblockUser: async (id) => axiosService.post(urls.forAdmin.unblockUser + "/" + id),
    getStatistics: () => axiosService.get(urls.forAdmin.statistics + "/orders"),
    getUserStatistics: async (id) => axiosService.get(urls.forAdmin.statistics + "/" +id)

};

export {adminService};