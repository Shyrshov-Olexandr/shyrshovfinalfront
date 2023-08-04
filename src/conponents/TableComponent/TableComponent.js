import DataTable from "react-data-table-component-with-filter";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

import {paidActions} from "../../redux/slices/paid.slice";
import css from "./table.module.css";
import loadingGif from "../../icons/loading.gif";
import resetPic from "../../icons/reset.png";
import excell from "../../icons/excell.png";
import {EditPaidComponent} from "./EditPaidComponent";
import {CommentForm} from "./CommentForm";

const TableComponent = () => {

    const {register, reset, handleSubmit} = useForm({
        mode: 'onChange'
    });

    const columns = [
        {
            selector: row => row.id,
        },

        {
            selector: row => row.name ? row.name : "null",
        },

        {
            selector: row => row.surname ? row.surname : "null",
        },

        {
            selector: row => row.phone ? row.phone : "null",
        },

        {
            selector: row => row.course ? row.course : " null",
        },

        {
            selector: row => row.courseFormat ? row.courseFormat : "null",
        },

        {
            selector: row => row.courseType ? row.courseType : "null",
        },

        {
            selector: row => row.email ? row.email : "null",
        },


        {
            selector: row => row.createdAt ? row.createdAt.split('T')[0] : "null"
        },


        {
            selector: row => row.user?.profile.username ? row.user?.profile.username : "null",
        },

    ];

    let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
    const decoded = jwt_decode(currentUser?.refresh_token);
    const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 1;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const urlSearchParams = new URLSearchParams();

    let search = window.location.search;

    const {paidArr} = useSelector(state => state.paidReducer);

    const {rejected} = useSelector(state => state.paidReducer);
    const {loading} = useSelector(state => state.paidReducer);
    const {success} = useSelector(state => state.paidReducer);

    let {currentPage} = useSelector(state => state.paidReducer);
    let {paidById} = useSelector(state => state.paidReducer);
    const {showEdit} = useSelector(state => state.paidReducer);
    const {updatedComments} = useSelector(state => state.paidReducer);
    const {idArr} = useSelector(state => state.paidReducer);

    let [timer, setTimer] = useState(null);
    let [showComment, setShowComment] = useState(false);
    let [spin, setSpin] = useState(false);
    let [currentComment, setCurrentComment] = useState(null);
    let [inputPrefill, setInputPrefill] = useState({});

    useEffect(() => {

        const pairs = search.split("&");
        const result = {};

        pairs.forEach(pair => {
            const [key, value] = pair.split("=");
            result[key] = value;
        });

        setInputPrefill(result)


        if (idArr.length === 0) {
            dispatch(paidActions.getAllPaid(search))
        }
        if (search.includes('&My=true')) {
            setChecked(true)
        }

        if (search.includes('&=undefined')) {
            window.history.pushState(null, null, search.replace("&=undefined", ''));
        }

        if (!isExpired) {
            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function () {
                window.history.go(1);
            };
        } else {
            navigate('/getStarted')
        }

    }, [currentPage, dispatch, search, isExpired, navigate, idArr]);


    const getNextPage = () => {
        currentPage++;
        let match = search.match(/page=(\d+)/);
        let page = match ? parseInt(match[1]) : null;
        navigate("/tables" + search.replace(page, currentPage))
    };

    const getPreviousPage = () => {
        currentPage--;
        let match = search.match(/page=(\d+)/);
        let page = match ? parseInt(match[1]) : null;
        navigate("/tables" + search.replace(page, currentPage))
    };


    const submit = (data) => {

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] !== "" && key !== "?page" && key !== "order") {
                    urlSearchParams.append(`${key}`, `${(decodeURIComponent(data[key]))}`);
                }
            }
        }

        let query = urlSearchParams.toString();

        clearTimeout(timer);

        const newTimer = setTimeout(() => {

            let url = window.location.href;

            if (url.includes('order=')) {

                let length = 'order='.length;
                let order = url.slice(url.indexOf('order=') + length);

                window.history.pushState("", query, '/tables?page=1&' + query + "&order=" + order);
                dispatch(paidActions.getAllPaid('?page=1&' + query + "&order=" + order));
            } else {
                if (!url.includes('My=true')) {
                    window.history.pushState("", query, '/tables?page=1&' + query);
                    dispatch(paidActions.getAllPaid('?page=1&' + query));
                } else {
                    window.history.pushState("", query, '/tables?page=1&' + query + "&My=true");
                    dispatch(paidActions.getAllPaid('?page=1&' + query + "&My=true"));
                }
            }
        }, 1000)
        setTimer(newTimer);
    };


    const accendingOrder = (orderBy) => {
        const queryParams = new URLSearchParams(search);
        queryParams.delete('order')

        window.history.pushState("", "", '/tables?' + queryParams.toString() + '&order=' + orderBy)

        let url = window.location.search;
        dispatch(paidActions.getAllPaid(url))
    }

    const descendingOrder = (orderBy) => {
        const queryParams = new URLSearchParams(search);
        queryParams.delete('order')

        window.history.pushState("", "", '/tables?' + queryParams.toString() + '&order=-' + orderBy)

        let url = window.location.search;
        dispatch(paidActions.getAllPaid(url))
    }
    const logOut = () => {
        localStorage.removeItem('currentUser');
        window.location = '/getStarted';
    };

    const goToAdminPage = () => {
        navigate('/admin')
    }

    const editPaid = (id) => {
        dispatch(paidActions.getPaidById(id))
    }

    const editDisabled = (user) => {
        return !(user === null || user?.profile.username === currentUser.profile.username);
    };

    const commentDisabled = (user) => {
        return !(user === null || user?.profile.username === currentUser.profile.username);
    }

    const addComment = (id) => {
        dispatch(paidActions.getPaidForComment(id))
        setCurrentComment(id)
        setShowComment(true)
    }

    let [checked, setChecked] = useState(false);


    const myClients = () => {

        if (checked) {
            setChecked(false)
            navigate(search.replace('&My=true', ''))
        } else {
            setChecked(true)
            navigate(search + "&My=true")
        }
    }


    const getExcel = async () => {
        let query = window.location.search;
        dispatch(paidActions.getExcel(query));
    }


    const ExpandedComponent = ({data}) =>
        <>
            <div className={css.DetailsFather}>
                <div className={css.details}>
                    <div className={css.statusDiv}>
                        <p>Status: {data.status ? data.status : <>null</>}</p>
                        <p>Group: {data.group?.name ? data.group?.name : <>null</>}</p>
                    </div>
                </div>

                <div className={css.details}>
                    <div>
                        <p>Name: {data.name}</p>
                        <p>Surname: {data.surname}</p>
                    </div>

                    <div>
                        <p>Email: {data.email}</p>
                        <p>Phone: {data.phone}</p>
                        <p>Age: {data.age}</p>
                    </div>

                    <div>
                        <p>Course: {data.course}</p>
                        <p>Course Format: {data.courseFormat}</p>
                        <p>Course Type: {data.courseType}</p>
                    </div>

                    <div>
                        <p>Sum: {data.sum ? data.sum : 0}</p>
                        <p>Already Paid: {data.alreadyPaid ? data.alreadyPaid : 0}</p>
                    </div>
                </div>


                <button disabled={editDisabled(data.user)} onClick={() => editPaid(data.id)}>edit</button>

            </div>
            <div className={css.msgCmntFather}>
                <div className={css.message}>
                    <div>
                        <p>message: {data.message ? data.message : <>null</>}</p>
                        <p>UTM: {data.utm ? data.utm : <>null</>}</p>
                    </div>

                </div>
                <div className={css.comments}>
                    <button disabled={commentDisabled(data.user)} onClick={() => addComment(data.id)}>Add comment
                    </button>
                    {showComment && currentComment === data.id ?
                        <CommentForm show={setShowComment} id={data.id}/> : null}
                    <div>

                        {updatedComments.comments && idArr.includes(data.id) ? updatedComments.comments.map(newComment =>

                                <div
                                    style={{
                                        marginTop: '10px',
                                        border: '1px solid rgb(28, 181, 224)',
                                        padding: '10px'
                                    }}
                                    key={newComment.id}>

                                    {newComment.user ? <p>{newComment.user?.profile.name}:</p> : null}

                                    <p>
                                        {newComment.comment}
                                    </p>

                                    <p>commented at |{newComment.created_at}|</p>
                                </div>
                            ) :


                            data.comments.map(comment => <div
                                style={{
                                    marginTop: '10px',
                                    border: '1px solid rgb(28, 181, 224)',
                                    padding: '10px'
                                }}
                                key={comment.id}>

                                {comment.user ? <p>{comment.user?.profile.name}:</p> : null}
                                <p>
                                    {comment.comment}
                                </p>
                                <p>commented at |{comment.created_at}|</p>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </>;

    //******************************************************
    //******************************************************
    //******************************************************

    return (
        <div>
            <div className={css.header}>
                <div className={css.userName}>
                    <h1> Hello, {currentUser?.profile.name}!</h1>
                </div>
                <div className={css.twoButtons}>
                    <div onClick={logOut} className={css.logout}>
                        <h1>Logout</h1>
                    </div>
                    {currentUser?.is_superuser ?
                        <div onClick={goToAdminPage} className={css.admin}><h1>Admin Page</h1></div> : null}
                </div>
            </div>

            <div className={css.mainFather}>
                <div className={'filters'} style={{
                    display: "flex",
                    height: "30px",
                    width: "100%"
                }}>
                    {/*//****************************************/}

                    <form className={css.form} onChange={handleSubmit(submit)}>
                        <div>
                            <input defaultValue={inputPrefill?.id} placeholder={'Id'}   {...register('id')}/>
                        </div>

                        <div>
                            <input defaultValue={inputPrefill?.name && decodeURIComponent(inputPrefill?.name)}
                                   placeholder={'Name'}   {...register('name')}/>

                        </div>

                        <div>
                            <input defaultValue={inputPrefill?.surname && decodeURIComponent(inputPrefill?.surname)}
                                   placeholder={'Surname'} {...register('surname')}/>
                        </div>

                        <div>
                            <input placeholder={'Phone'} defaultValue={inputPrefill?.phone}  {...register('phone')}/>
                        </div>

                        <div>
                            <select id="Course" placeholder={'fee'} name="course"
                                    value={inputPrefill?.course || ''} {...register('course')}>
                                <option value="">All Courses</option>
                                <option value="FS">
                                    Full Stack
                                </option>
                                <option value="FE">Front End</option>
                                <option value="JSCX">Java Script Complex</option>
                                <option value="JCX">Java Complex</option>
                                <option value="PCX">Python Complex</option>
                                <option value="QACX">QA Complex</option>
                            </select>
                        </div>
                        <div>
                            <select id="CourseFormat" name="courseFormat"
                                    value={inputPrefill?.courseFormat || ''} {...register('courseFormat')}>
                                <option value="">all Formats</option>
                                <option value="static">Static</option>
                                <option value="online">Online</option>
                            </select>
                        </div>
                        <div>
                            <select id="CourseType" name="courseType"
                                    value={inputPrefill?.courseType || ''} {...register('courseType')}>
                                <option value="">All Types</option>
                                <option value="minimal">Minimal</option>
                                <option value="pro">Pro</option>
                                <option value="premium">Premium</option>
                                <option value="incubator">Incubator</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>

                        <div>
                            <input placeholder={'Email'} defaultValue={inputPrefill?.email} {...register('email')}/>
                        </div>

                        <div style={{
                            marginTop: '-10px',
                            display: "flex",
                            flexDirection: 'column',
                            gap: '5px',
                            height: 'fit-content'
                        }}>
                            <input type={"date"} defaultValue={inputPrefill?.startDate} {...register('startDate')} />
                            <input type={"date"} defaultValue={inputPrefill?.endDate} {...register('endDate')} />
                        </div>


                        {/*//****************************************/}

                    </form>

                    <div style={{height: '100px', width: '200px'}}>
                        <div style={{display: "flex", width: '50px', paddingRight: '5px'}}>
                            <input style={{width: '20px', height: '20px'}} type={"checkbox"} checked={checked}
                                   onChange={myClients}
                                   placeholder={"mine"}/>My
                            <img className={spin ? css.spinning : css.reset} onClick={() => {
                                reset();
                                setSpin(true)
                                setTimeout(() => {
                                    setSpin(false)
                                }, 900)
                                window.history.pushState("", "", "/tables?page=" + currentPage)
                                setInputPrefill({})
                                dispatch(paidActions.getAllPaid('?page=' + currentPage))
                            }} src={resetPic} alt={'reset'}/>
                            <img onClick={getExcel} style={{marginLeft: '10px', width: '30px', cursor: 'pointer'}}
                                 src={excell}
                                 alt={'excell download'}/>
                        </div>
                    </div>
                </div>
                <div className={css.ordering}>
                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('id') : descendingOrder('id')
                    }}>Id
                    </div>
                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('name') : descendingOrder('name')
                    }}>Name
                    </div>
                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('surname') : descendingOrder('surname')
                    }}>Surname
                    </div>
                    <div style={{cursor: 'default'}}>Phone</div>
                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('course') : descendingOrder('course')
                    }}>Course
                    </div>
                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('courseFormat') : descendingOrder('courseFormat')
                    }}>Course Format
                    </div>

                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('courseType') : descendingOrder('courseType')
                    }}>Course Type
                    </div>

                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('email') : descendingOrder('email')
                    }}>Email
                    </div>

                    <div onClick={() => {
                        window.location.href.includes('order=-') ? accendingOrder('createdAt') : descendingOrder('createdAt')
                    }}>Created at
                    </div>

                    {/*<div style={{cursor: 'default'}}>*/}
                    {/*    Group*/}
                    {/*</div>*/}

                    <div style={{cursor: 'default'}}>
                        Manager
                    </div>
                </div>

                <div>
                    {loading ?
                        <div style={{background: "#FBFBFB", width: "100%", display: "flex", justifyContent: "center"}}>
                            <img src={loadingGif} alt={"loading"}/>
                        </div> : null}


                    {rejected ? <h1 style={{textAlign: 'center', margin: '235.5px'}}>There are no record to display</h1> : null}
                    {success ?
                        <DataTable
                            columns={columns}
                            responsive={true}
                            data={paidArr.content}
                            expandableRows
                            expandableRowsComponent={ExpandedComponent}
                            noTableHead={true}
                        />
                        : null}
                </div>
            </div>
            <div className={css.footer}>
                <button className={css.button} disabled={currentPage === 1} onClick={getPreviousPage}>
                    Previous
                </button>
                <div className={css.paragraphs}>
                    <p>current page: {currentPage}</p>
                    <p>total pages: {paidArr.totalPages}</p>
                </div>
                <button className={css.button} disabled={paidArr.last === true} onClick={getNextPage}>
                    Next
                </button>
            </div>


            <div className={css.black}>
                <div className={css.editForm}>
                    {showEdit ?
                        <div className={css.black}>
                            <EditPaidComponent preloadedValues={paidById}/>
                        </div>
                        : null}
                </div>
            </div>
        </div>
    )
}

export {
    TableComponent
};