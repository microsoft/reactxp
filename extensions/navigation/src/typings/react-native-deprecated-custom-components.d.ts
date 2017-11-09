declare module 'react-native-deprecated-custom-components' {
    import RN = require('react-native');

    interface NavigatorProps extends RN.ComponentPropsBase {
        configureScene?: Function;
        initialRoute?: any;
        initialRouteStack?: any[];
        navigatorBar?: any;
        navigator?: Navigator;
        onDidFocus?: Function; //deprecated
        onWillFocus?: Function; //deprecated
        renderScene: Function;
        sceneStyle?: RN.StyleRuleSet | RN.StyleRuleSet[];
    }

    class Navigator extends RN.ReactNativeBaseComponent<NavigatorProps, {}> {
        static SceneConfigs: {
            PushFromRight: any;
            FloatFromRight: any;
            FloatFromLeft: any;
            FloatFromBottom: any;
            FloatFromBottomAndroid: any;
            FadeAndroid: any;
            HorizontalSwipeJump:any;
        };
        getCurrentRoutes(): any[];
        jumpBack(): void;
        jumpForward(): void;
        jumpTo(route: any): void;
        push(route: any): void;
        pop(): void;
        replace(route: any): void;
        replaceAtIndex(route: any, index: number): void;
        replacePrevious(route: any): void;
        immediatelyResetRouteStack(routeStack: any[]): void;
        popToRoute(route: any): void;
        popToTop(): void;
    }

}