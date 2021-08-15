export type ResponsivenessState = 'xs'|'sm'|'md'|'lg'|'xl'|'xxl';
export type ThemeState = 'light'|'dark';
export type UIState = {
    /** @true for open  @false for closed */
    sidebar: boolean;
    responsiveness: ResponsivenessState;
    theme: ThemeState;
    collapsedMenu: boolean;

}