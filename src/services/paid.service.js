import {axiosService} from "./axios.service";
import {urls} from "../configs/urls";

const paidService = {
    getAllPaid: (query) => axiosService.get(urls.paid.getAllPaid + query,),
    getPaidById: (id) => axiosService.get(urls.paid.getAllPaid + "/" + id),
    changePaidById: async (data,id) => axiosService.patch(urls.paid.getAllPaid + "/" + id , data),

    getAllGroups: () => axiosService.get(urls.paid.group),
    createGroup: (data) => axiosService.post(urls.paid.group, data),

    getExcel: (query) => axiosService.get(urls.paid.getExcel + query, {responseType: 'arraybuffer'})
}


export {paidService};