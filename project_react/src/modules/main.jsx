import { createAction, handleActions } from "redux-actions";

const SET_SCROLL_Y = 'main/SET_SCROLL_Y';

export const setScrollY = createAction(SET_SCROLL_Y);

const initialState = {
    scrollY: 0,
};

const main = handleActions({
    [SET_SCROLL_Y]: (state, action) =>({
        ...state,
        scrollY: action.payload,
    })
}, initialState);

export default main;