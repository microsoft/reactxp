export interface ITransitionSpec {
    property: string;
    duration: number;
    timing?: string;
    delay?: number;
    from: any;
    to: any;
}
export declare function executeTransition(element: HTMLElement, transitions: ITransitionSpec[], done: () => void): void;
export default executeTransition;
