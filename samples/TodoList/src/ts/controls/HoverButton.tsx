/*
* HoverButton.tsx
* Copyright: Microsoft 2018
*
* A button that renders differently when the mouse pointer
* is hovering over it.
*/

import * as RX from 'reactxp';

export interface HoverButtonProps extends RX.CommonProps {
    onRenderChild: (isHovering: boolean) => JSX.Element | null;
    onPress?: (e: RX.Types.SyntheticEvent) => void;
    title?: string;
    disabled?: boolean;
}

export interface HoverButtonState {
    isHovering: boolean;
}

export default class HoverButton extends RX.Component<HoverButtonProps, HoverButtonState> {
    render(): JSX.Element | null {
        return (
            <RX.Button
                onPress={ this._onPress }
                onHoverStart={ this._onHoverStart }
                onHoverEnd={ this._onHoverEnd }
                title={ this.props.title }
                disabled={ this.props.disabled }
            >
                { this.props.onRenderChild(this.state ? this.state.isHovering : false) }
            </RX.Button>
        );
    }

    private _onPress = (e: RX.Types.SyntheticEvent) => {
        if (this.props.onPress) {
            this.props.onPress(e);
        }
    };

    private _onHoverStart = () => {
        if (!this.props.disabled) {
            this.setState({ isHovering: true });
        }
    };

    private _onHoverEnd = () => {
        if (!this.props.disabled) {
            this.setState({ isHovering: false });
        }
    };
}
