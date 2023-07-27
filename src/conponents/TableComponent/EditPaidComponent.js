import {Controller, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'

import {paidActions} from "../../redux/slices/paid.slice";
import css from "../AdminComponent/admin.module.css"
import {joiResolver} from "@hookform/resolvers/joi";
import {editValidator} from "../../validators/edit.validator";
import {useEffect, useState} from "react";


const EditPaidComponent = ({preloadedValues}) => {

    const {register, control, reset, handleSubmit, formState: {isValid, errors}} = useForm({
        mode: 'all',
        resolver: joiResolver(editValidator)
    });

    const dispatch = useDispatch();
    const currentUrl = window.location.search;
    const {groupsArr} = useSelector(state => state.paidReducer)

    let [showAddGroup, setShowAddGroup] = useState(false)

    useEffect(() => {
        dispatch(paidActions.getAllGroups())
    }, [dispatch])

    const submit = (data) => {

        dispatch(paidActions.patchPaidById({editData:data, id: data.id}))

        setTimeout(() => {
            dispatch(paidActions.getAllPaid(currentUrl))
        }, 1000)
    }

    const closeEdit = () => {
        dispatch(paidActions.closeEditing())
    }

    const switchStateTrue = () => {
        setShowAddGroup(true)
    }

    const switchStateFalse = () => {
        setShowAddGroup(false)
    }

    const createGroup = (data) => {
        let requiredData = JSON.parse(`{"name":"${data.group}"}`)
        dispatch(paidActions.createGroup(requiredData))
        reset()

        setTimeout(() => {
            dispatch(paidActions.getAllGroups())
        }, 1000)
    };

    return (
        <div className={css.black}>
            <div className={css.registerForm}>
                <form style={{height: '600px', background: 'linear-gradient(90deg, #1CB5E0 0%, #000851 100%)', boxShadow: '5px 20px 50px #000'}}
                      className={css.userForm} onSubmit={
                    showAddGroup ? handleSubmit(createGroup) : handleSubmit(submit)
                }>
                    <div className={css.field}>
                        <div>
                            <p>Group</p>

                            <input style={{display:'none'}} defaultValue={preloadedValues.id} placeholder={'id'} name={'id'} {...register('id')}/>


                            {showAddGroup ? <input placeholder={'group'} name={'group'} {...register('group')}/>
                                : <select defaultValue={preloadedValues?.group?.name}
                                          style={{
                                              width: '219.33px',
                                              height: "29.5px",
                                              margin: "5px"
                                          }}  {...register('group')}>
                                    {groupsArr.map((group) =>
                                        <option key={group.id} value={group.name}>{group.name}</option>
                                    )}
                                </select>}

                            {showAddGroup ?
                                <div style={{display: 'flex', width: '100%'}}>
                                    <div style={{
                                        height: '20px',
                                        width: '100%',
                                        background: 'deepskyblue',
                                        textAlign: 'center',
                                        color: 'white',
                                        cursor: 'pointer',
                                        borderRadius: '10px',
                                        borderTopRightRadius: '0',
                                        borderBottomRightRadius: '0',
                                        borderRight: '1px solid #003b4f'
                                    }}
                                         onClick={switchStateFalse}>select
                                    </div>
                                    <button style={{
                                        height: '20px',
                                        width: "50px",
                                        borderTopLeftRadius: '0',
                                        borderBottomLeftRadius: '0',
                                    }} type={'submit'}>add
                                    </button>
                                </div>
                                :
                                <div style={{
                                    height: '20px',
                                    width: '100%',
                                    background: 'deepskyblue',
                                    textAlign: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: '10px',
                                }}
                                     onClick={switchStateTrue}>add</div>}
                        </div>
                        <div>
                            <p>Status</p>
                            <select
                                defaultValue={preloadedValues?.status === "" || preloadedValues?.status === null ? "InWork" : preloadedValues?.status}
                                style={{width: '219.33px', height: "29.5px", margin: "5px"}}  {...register('status')}>
                                <option value="INWORK">InWork</option>
                                <option value="AGREE">Agree</option>
                                <option value="DISAGREE">Disagree</option>
                                <option value="DUBBING">Dubbing</option>
                                <option value="NEW">New</option>
                            </select>
                        </div>
                    </div>

                    <div className={css.field}>

                        <div>
                            <p>Name</p>
                            <input defaultValue={preloadedValues.name} placeholder={'Name'}
                                   name={'name'} {...register('name')}/>
                        </div>

                        <div>
                            <p>Surname</p>
                            <input defaultValue={preloadedValues.surname} placeholder={'Surname'}
                                   name={'surname'}  {...register('surname')}/>
                        </div>


                    </div>

                    <div className={css.field}>
                        <div>
                            <p>Phone</p>
                            <Controller control={control}
                                        defaultValue={preloadedValues?.phone ? preloadedValues?.phone : null}
                                        name={'phone'} render={
                                ({field: {ref, ...field}}) => (
                                    <PhoneInput
                                        disableDropdown={true}
                                        containerStyle={{
                                            width: "229px",
                                            height: "30px",
                                            background: "#e0dede",
                                            padding: "5px",
                                            border: "none",
                                            outline: "none",
                                            borderRadius: "5px",
                                            marginLeft: '5px'
                                        }}
                                        buttonStyle={{
                                            border: "none",
                                            background: 'none',
                                            position: 'relative',
                                            top: '-55px',
                                            left: '37px'
                                        }}
                                        inputStyle={{
                                            background: "none",
                                            border: 'none',
                                            padding: '0',
                                            minWidth: '219px'
                                        }}   {...field}/>
                                )}/>
                        </div>
                        <div>
                            <p>Email</p>
                            <input defaultValue={preloadedValues.email} placeholder={'Email'}
                                   name={"email"}  {...register('email')}/>
                        </div>

                    </div>

                    <div className={css.field}>

                        <div>
                            <p>Course</p>
                            <select defaultValue={preloadedValues.course}
                                    style={{width: '219.33px', height: "29.5px", margin: "5px"}} id="Course"
                                    name={"course"}   {...register('course')}>
                                <option value=""></option>
                                <option value="FS">Full Stack</option>
                                <option value="FE">Front End</option>
                                <option value="JSCX">Java Script Complex</option>
                                <option value="JCX">Java Complex</option>
                                <option value="PCX">Python Complex</option>
                                <option value="QACX">QA Complex</option>
                            </select>
                        </div>

                        <div>
                            <p>Course Format</p>
                            <select defaultValue={preloadedValues.courseFormat}
                                    style={{width: '219.33px', height: "29.5px", margin: "5px"}} id="CourseFormat"
                                    name={"courseFormat"}  {...register('courseFormat')}>
                                <option value=""></option>
                                <option value="static">Static</option>
                                <option value="online">Online</option>
                            </select>
                        </div>
                    </div>

                    <div className={css.field}>

                        <div>
                            <p>Course Type</p>
                            <select style={{minWidth: '219.23px', height: "29.5px", margin: "5px"}}
                                    defaultValue={preloadedValues.courseType} id="CourseType"
                                    name={"courseType"} {...register('courseType')}>
                                <option value=""></option>
                                <option value="minimal">Minimal</option>
                                <option value="pro">Pro</option>
                                <option value="premium">Premium</option>
                                <option value="incubator">Incubator</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>

                        <div>
                            <p>Age</p>
                            <input defaultValue={preloadedValues.age} placeholder={'age'}
                                   name={'age'} {...register('age')}/>
                        </div>
                    </div>

                    <div className={css.field}>
                        <div>
                            <p>Sum</p>
                            <input defaultValue={preloadedValues.sum} placeholder={'sum'}
                                   name={'sum'} {...register('sum')}/>
                        </div>

                        <div>
                            <p>Already Paid</p>
                            <input defaultValue={preloadedValues.alreadyPaid} placeholder={'alreadyPaid'}
                                   name={'alreadyPaid'} {...register('alreadyPaid')}/>
                        </div>

                    </div>

                    {errors.name || errors.surname || errors.email || errors.phone || errors.sum || errors.alreadyPaid || errors.course || errors.courseType || errors.courseFormat || errors.age ?
                        <span className={css.span}>Form is invalid</span> : null}

                    <div style={{display: 'flex'}}>
                        <button style={{width: "100px", margin: "10px"}} onClick={closeEdit}>Close</button>
                        <button className={css.submitBtn} disabled={!isValid} style={{width: "100px", margin: "10px",}}
                                type={"submit"}>Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export {EditPaidComponent}