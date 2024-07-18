import { combineReducers } from "redux";
import main from "./main";
import auth from "./auth";
import { loading } from "./loading";
import user from "./user";
import post from "./post";
import postList from "./postList";
import write from "./write";
import inquirySave from "./inquirySave";

export const rootReducer = combineReducers({
    main,
    auth,
    loading,
    user,
    post,
    postList,
    write,
    inquirySave,
})