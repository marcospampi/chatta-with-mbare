import { createReducer, on } from "@ngrx/store";
import { UIState } from ".";
import { actions } from "./actions";

export const defaultTheme = ( ) => {
    const whatShouldBe = matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    const butUserExpects = localStorage['theme'];
    if ( butUserExpects && ['light', 'dark'].includes(butUserExpects) )
        return butUserExpects;
    else
        return whatShouldBe;
};

export const reducer = createReducer<UIState>(
    {
        responsiveness: 'xs',
        sidebar: true,
        theme: defaultTheme(),
        collapsedMenu: true
    },
    on(actions.responsivenessChange, (state, props) => ({
        ...state,
        responsiveness: props.value,
        collapsedMenu: ['xs','sm'].includes(props.value)
    })),
    on(actions.toggleSidebar, (state, props) => ({
        ...state,
        sidebar: typeof (props.value) == 'boolean' ? props.value : !state.sidebar
    })),
    on(actions.toggleTheme, (state, props ) => {
        const newState = {
            ...state,
            theme: typeof(props.value) == 'string' 
                ? props.value 
                : state.theme == 'dark' ? 'light' : 'dark'
        };
        localStorage['theme'] = newState.theme;
        return newState;
    })
);