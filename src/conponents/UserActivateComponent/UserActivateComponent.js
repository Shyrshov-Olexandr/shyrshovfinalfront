import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";

import {adminActions} from "../../redux/slices/admin.slice";
import css from "./passwordConfirm.module.css"
import {useState} from "react";

const UserActivateComponent = () => {

    const {register, handleSubmit} = useForm({
        mode: 'onChange'
    });

    const dispatch = useDispatch();

    let [error, setError] = useState(false);
    let [success, setSuccess] = useState(false);
    let [empty, setEmpty] = useState(false);
    let [goToLogin, setGoTologin] = useState(false)

    const submit = (data) => {
        if (data.password !== '' && data.confirmPassword !== '') {
            if (data.password === data.confirmPassword) {
                dispatch(adminActions.activateUser(data))
                setSuccess(true)
                setGoTologin(true)
                setEmpty(false)
                setError(false)
            } else {
                setError(true)
                setSuccess(false)
                setEmpty(false)
            }
        } else {
            setEmpty(true)
            setSuccess(false)
            setError(false)
        }
    }


    const redirect = () => {
        localStorage.removeItem('currentUser')
        window.location.href = '/getStarted'
    }

    return (
        <div className={css.wrap}>
            <div className={css.main}>
                {success || empty || error ? null : <h1>Welcome! Please, create the password</h1>}
                {success ? <h1>Password Created!</h1> : null}
                {empty ? <h1>Some of fields are empty</h1> : null}
                {error ? <h1>Passwords are different</h1> : null}
                {goToLogin ? <button onClick={redirect}>go to login page</button> : null}
                {success ? null : <form className={css.form} onSubmit={handleSubmit(submit)}>
                    <input type={"password"} placeholder={'enter a password'} {...register('password')}/>
                    <input type={"password"} placeholder={'confirm password'} {...register('confirmPassword')} />
                    <button type={"submit"}>Submit</button>
                </form>}
            </div>
        </div>
    )
}

export {UserActivateComponent}