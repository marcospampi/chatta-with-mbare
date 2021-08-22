import { createReducer, on } from "@ngrx/store";
import { UIState } from ".";
import { actions } from "./actions";

export const themeColor = {
    'dark': getComputedStyle(document.documentElement).getPropertyValue(`--theme-color-dark`),
    'light': getComputedStyle(document.documentElement).getPropertyValue(`--theme-color-light`),
    set theme( theme: string ) {
        // @ts-ignore
        document.querySelector("meta[name='theme-color']").content = this[theme];
    }
}



export const defaultTheme = ( ) => {
    const whatShouldBe = matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light';
    const butUserExpects = localStorage['theme'];
    if ( butUserExpects && ['light', 'dark'].includes(butUserExpects) )
        return butUserExpects;
    else
        return whatShouldBe;
};
themeColor.theme = defaultTheme();
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
        themeColor.theme = newState.theme;
        return newState;
    })
);