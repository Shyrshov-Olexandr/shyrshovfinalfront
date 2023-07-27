import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import DataTable from "react-data-table-component-with-filter";
import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {joiResolver} from "@hookform/resolvers/joi"

import {adminActions} from "../../redux/slices/admin.slice";
import css from "./admin.module.css"
import {formValidator} from "../../validators/form.validator";

const AdminComponent = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {usersArr} = useSelector(state => state.adminReducer);
    //const {statisticsArr} = useSelector(state => state.adminReducer);
    const {userStatistics} = useSelector(state => state.adminReducer);
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
    ]

    useEffect(() => {
        if (user?.is_superuser) {
            dispatch(adminActions.getAllUsers())
        } else {
            navigate('/tables?page=1')
        }
    }, [dispatch, navigate, user?.is_superuser])

    const goToTables = () => {
        navigate('/tables')
    }

    const showForm = () => {
        setUserForm(true)
    }
    const removeForm = () => {
        setUserForm(false)
    }
    const submit = (data) => {
        console.log(data)
        dispatch(adminActions.registerUser(data))
        reset()
    };

    const createActivationLink = (id) => {
        dispatch(adminActions.recreateActivationLink(id))

        if (recreatedActivationLink) {
            navigator.clipboard.writeText(`http://localhost:3000/admin/activate/${recreatedActivationLink.token}`);
        }

    }


    const deleteUser = (id) => {
        dispatch(adminActions.deleteUser(id))

        setTimeout(() => {
            dispatch(adminActions.getAllUsers())
        }, 1000)
    }

    const blockUser = (id) => {
        dispatch(adminActions.blockUser(id))

        setTimeout(() => {
            dispatch(adminActions.getAllUsers())
        }, 1000)


    };

    const unblockUser = (id) => {
        dispatch(adminActions.unblockUser(id))

        setTimeout(() => {
            dispatch(adminActions.getAllUsers())
        }, 1000)

    }

    let [statisticsId, setStatisticsId] = useState(null);
    const getUserStatistics = (id) => {
        dispatch(adminActions.getUserStatistics(id))
        setStatisticsId(id)
    }


    const ExpandedComponent = ({data}) =>
        <>
            <div className={css.controlButtons}>
                <div style={{display: 'flex'}}>
                    {data.is_active || data.is_blocked ? null : <button className={css.button} onClick={() => {
                        createActivationLink(data.id)
                    }}>Create activation link</button>}

                    <button className={css.button} onClick={() => {
                        setConfirmDiv(true)
                        setConfirmId(data.id)
                    }}>delete user
                    </button>

                    {data.is_blocked ?
                        <button className={css.button} onClick={() => unblockUser(data.id)}>unblock user</button> :
                        <button className={css.button} onClick={() => blockUser(data.id)}>block user</button>}
                    <button className={css.button} onClick={() => getUserStatistics(data.id)}>get Statistics</button>
                </div>

                <div>
                    {confirmDiv && data.id === confirmId ?
                        <div>
                            <div>
                                <p style={{textAlign: 'center'}}>Are you sure?</p>
                            </div>

                            <div style={{display: 'flex'}}>
                                <button className={css.button} onClick={() => {
                                    deleteUser(data.id)
                                }}>yes!
                                </button>
                                <button className={css.button} onClick={() => {
                                    setConfirmDiv(false)
                                }}>no...
                                </button>
                            </div>
                        </div>
                        : null}
                </div>
            </div>

            {userStatistics && statisticsId === data.id ?

                <div className={css.statistics}>
                    <p>STATISTICS</p>
                    <p>NEW: {userStatistics.statuses?.newCount}</p>
                    <p>IN WORK: {userStatistics.statuses?.inWorkCount}</p>
                    <p>DOUBLE: {userStatistics.statuses?.doubleCount}</p>
                    <p>AGREE: {userStatistics.statuses?.agreeCount}</p>
                    <p>DISAGREE: {userStatistics.statuses?.disagreeCount}</p>
                    <p>Total: {userStatistics.totalCount}</p>
                </div>
                : null}
        </>;

    //****************************************************

    return (
        <>
            <div className={css.header}>
                <div style={{height:'30px'}} onClick={goToTables} className={css.button}>
                    <h1>
                        Back to tables
                    </h1>
                </div>

                {/*<div style={{height:'30px'}} onClick={showForm} className={css.button}>*/}
                {/*    <h1>*/}
                {/*        Add User*/}
                {/*    </h1>*/}
                {/*</div>*/}
            </div>

            <div>
                <DataTable
                    columns={columns}
                    data={usersArr}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                />
            </div>

            {userForm ?
                <div className={css.black}>
                    <div className={css.wrap}>

                        <div className={css.main}>
                            <h1 onClick={removeForm}
                                style={{
                                    position: "fixed",
                                    top: "80px",
                                    right: "37%",
                                    cursor: "pointer",
                                    width: "fit-content"
                                }}>x</h1>

                            <form className={css.registerForm} onSubmit={handleSubmit(submit)}>
                                <input placeholder={'email'} {...register('email')}/>
                                {errors.email && <span className={css.span}>{errors.email.message}</span>}
                                <input placeholder={'name'} {...register('name')}/>
                                {errors.name && <span className={css.span}>{errors.name.message}</span>}
                                <input placeholder={'username'} {...register('username')}/>
                                {errors.username && <span className={css.span}>{errors.username.message}</span>}
                                <button disabled={!isValid} type={"submit"}>submit</button>
                            </form>

                            {registerData?.token ?
                                <p className={css.copyUrl} onClick={() => {
                                    navigator.clipboard.writeText(`http://localhost:3000/admin/activate/${registerData?.token}`);
                                    setSuccessMessage(true)
                                }}>click to copy url</p>
                                : null}

                            {successMessage ?
                                <p className={css.successMessage} style={{textAlign: "center"}}>url copied <br/>Now send
                                    it to user so he could activate account</p>
                                : null}
                        </div>
                    </div>
                </div>
                : null}
        </>
    )
}

export {AdminComponent};