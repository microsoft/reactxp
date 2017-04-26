import RX = require('../common/Interfaces');
import Types = require('../common/Types');
export interface TextInputState {
    inputValue?: string;
    isFocused?: boolean;
}
export declare class TextInput extends RX.TextInput<TextInputState> {
    private _selectionStart;
    private _selectionEnd;
    constructor(props: Types.TextInputProps);
    componentWillReceiveProps(nextProps: Types.TextInputProps): void;
    render(): JSX.Element;
    private _onFocus;
    private _onBlur;
    private _onChangeText;
    private _onSelectionChange;
    private _onKeyPress;
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
