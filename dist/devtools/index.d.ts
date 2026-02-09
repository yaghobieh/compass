type CompassDevToolsConfig = {
    enabled?: boolean;
    position?: 'right' | 'left';
    showConsoleLog?: boolean;
    panelWidth?: number;
    defaultTheme?: 'dark' | 'light';
};
declare const CompassDevTools: (props: CompassDevToolsConfig) => JSX.Element | null;

export { CompassDevTools };
