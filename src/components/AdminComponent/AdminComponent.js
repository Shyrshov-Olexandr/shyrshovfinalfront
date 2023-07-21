import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {joiResolver} from "@hookform/resolvers/joi";
import {useForm} from "react-hook-form";
import {adminActions} from "../../redux";
const AdminComponent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {userArr} = useSelector(state => state.adminReduser);
    const {userStatistics} = useSelector(state => state.adminReduser);
    const {registerData} = useSelector(state => state.adminReducer);
    const {recreatedActivationLink} = useSelector(state => state.adminReducer);

    let [successMessage, setSuccessMessage] = useState(false);
    let [userForm, setUserForm] = useState(false);
    let [confirmDiv, setConfirmDiv] = useState(false);
    let [confirmId, setConfirmId] = useState(null);

    const {register, reset, handleSubmit, formState: {isValid, errors}} = useForm({
        resolver: joiResolver(formValidator),
        mode: 'all'
    });

    let user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;

    const columns = [
        {
            name: 'id',
            selector: row => row.id,
        },

        {
            name: 'name and nickname',
            selector: row => `${row.profile.name} (${row.profile.username})`,
        },

        {
            name: 'email',
            selector: row => row.email,
        },

        {
            name: 'role',
            selector: row => row.is_superuser ? 'super admin' : "admin"
        },

        {
            name: "is activated",
            selector: row => row.is_active ? 'yes' : row.is_blocked ? <span style={{color: 'red'}}>blocked</span> : "no"
        }
    ];

    useEffect(() => {
        if (user?.is_superuser) {
            dispatch(adminActions.getAllUsers());
        } else {
            navigate('/tables?page=1');
        }
    }, [dispatch, navigate, user?.is_superuser]);

    const goToTables = () => {
        navigate('/tables');
    };

    const showForm = () => {
        setUserForm(true);
    };

    const removeForm = () => {
        setUserForm(false);
    };

    const submit = (data) => {
        console.log(data);
        dispatch(adminActions.registerUser(data));
        reset();
    };

    const createActivationLink = (id) => {
        dispatch(adminActions.recreateActivationLink(id));
        if (recreatedActivationLink) {
            navigator.clipboard.writeText(`http://localhost:3000/admin/activate/${recreatedActivationLink.token}`);
        }
    };

    const deleteUser = (id) => {
        dispatch(adminActions.deleteUser(id));
        setTimeout(() => {
            dispatch(adminActions.getAllUsers())
        }, 1000)
    };

    const blockUser = (id) => {
        dispatch(adminActions.blockUser(id));
        setTimeout(() => {
            dispatch(adminActions.getAllUsers())
        }, 1000)
    };

    const unblockUser = (id) => {
        dispatch(adminActions.unblockUser(id));
        setTimeout(() => {
            dispatch(adminActions.getAllUsers())
        }, 1000)
    };

    let [statisticsId, setStatisticsId] = useState(null);

    const getUserStatistics = (id) => {
        dispatch(adminActions.getUserStatistics(id));
        setStatisticsId(id);
    };


};