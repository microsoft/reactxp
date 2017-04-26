import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export interface TextInputState {
    inputValue?: string;
}
export declare class TextInput extends RX.TextInput<TextInputState> {
    private _selectionStart;
    private _selectionEnd;
    constructor(props: Types.TextInputProps);
    componentWillReceiveProps(nextProps: Types.TextInputProps): void;
    componentDidMount(): void;
    render(): JSX.Element;
    private _onPaste;
    private _onInput;
    private _checkSelectionChanged;
    private _onKeyDown;
    private _onScroll;
    blur(): void;
    focus(): void;
    isFocused(): boolean;
    selectAll(): void;
    selectRange(start: number, end: number): void;
    getSelectionRange(): {
        start: number;
        end: number;
    };
    setValue(value: string): void;
}
export default TextInput;
