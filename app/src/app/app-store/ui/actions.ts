import { createAction, props } from "@ngrx/store";
import { ResponsivenessState, ThemeState } from "./ui-state";

export enum ACTIONS_ENUM {
    responsivenessChange = '[UI] RESPONSIVENESS_CHANGE',
    toggleSidebar = '[UI] TOGGLE_SIDEBAR',
    toggleTheme = "[UI] TOGGLE_THEME"
}
export const actions = {
    responsivenessChange: createAction(ACTIONS_ENUM.responsivenessChange, props<{ value: ResponsivenessState }>()),
    toggleSidebar: createAction(ACTIONS_ENUM.toggleSidebar, props<{ value?: boolean }>()),
    toggleTheme: createAction(ACTIONS_ENUM.toggleTheme, props<{value?: ThemeState}>())
};