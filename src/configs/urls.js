const baseURL = 'http://localhost:6060/api';

const urls = {
    signUpIn:
        {
            signIn: '/auth/signin',
            signUp: '/auth/signup'
        },
    forAdmin:
        {
            getAllUsers: '/admin/users',
            userRegister: '/admin/users/reg',
            userActivate: '/admin/activate',
            recreateToken: '/admin/users/re_token',
            deleteUser: '/admin/delete',
            blockUser: '/admin/block',
            unblockUser: '/admin/unblock',
            statistics: '/admin/statistics/users'
        },
    paid:
        {
            getAllPaid: 'paid',
            getExcel: 'paid/excel',
            group: '/paid/group'
        },
    permissions:
        {
            createPermission: '/permissions/create'
        }
}

export {baseURL, urls}