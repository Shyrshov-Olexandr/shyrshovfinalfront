import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {joiResolver} from "@hookform/resolvers/joi";

import {paidActions} from "../../redux/slices/paid.slice";
import {commentValidator} from "../../validators/comment.validator";
import css from "./comment.module.css";


const CommentForm = ({show, id}) => {

    const {register, handleSubmit,formState:{isValid,errors}} = useForm({
        mode:'all',
        resolver: joiResolver(commentValidator)
    });

    const dispatch = useDispatch();

    const commentSubmit = (data) => {
        dispatch(paidActions.patchPaidById({editData:data,id:data.id}))
        show(false)
    }

    return (
        <>
            <form className={css.form} onSubmit={handleSubmit(commentSubmit)}>
                <input style={{display:'none'}} defaultValue={id} {...register('id')}/>
                <input style={{width:'200px'}}  placeholder={'comment'} {...register('comment')}/>
                <button style={{width:'100px', borderRadius:'10px', transition:'ease-in-out 0.3s'}} disabled={!isValid} type={"submit"}>Comment</button>
            </form>
            {errors.comment?<span className={css.commentSpan}>{errors.comment.message}</span> :null}
        </>
    )
}

export {CommentForm}