---
id: react_concepts
title: React Concepts
layout: docs
category: Overview
permalink: docs/react_concepts.html
next: react_lifecycle
---

## Components

UI elements in React are called *components*. A component defines the appearance (layout, style, motion) and the behavior of the UI element. Once a component is defined, it can be incorporated within other components to build a complete user interface.

## Rendering

React components derive from the templated base class React.Component<P, S>. P and S refer to *props* and *state*, two concepts that we will explore below. The most important method in a React component is the *render* method. The example below shows a minimal React component that simply renders some text.

    class HelloWorld extends React.Component<void, void> {
        render() {
            return <div>Hello World</div>;
        }
    }

This example uses the JSX angle bracket syntax. TypeScript 1.6 contains native support for this notation. Simply name your source file with a "tsx" file extension rather than "ts".

Note that this component is emitting a "div" tag, which is valid only in browser environments. To make this into a ReactXP component, simply replace the "div" with a "RX.Text" tag.

    class HelloWorld extends RX.Component<void, void> {
        render() {
            return <RX.Text>Hello World</RX.Text>;
        }
    }

Also note that `RX.Component` replaces `React.Component` in the above example. [ReactXP *re-exports* `React.Component`](https://github.com/Microsoft/reactxp/blob/master/src/web/ReactXP.ts#L131) as `RX.Component` so your imports remain tidy, you don't need to import `React` specifically.

## Props
It's convenient for parent components to customize child components by specifying parameters. React allows components to define a set of properties (or "props" for short). Some props are required, others are optional. Props can be simple values, objects, or even functions.

We will modify the Hello World example to introduce an optional "userName" prop. If specified, the component will render a hello message to the user. Methods within the component class can access the props using "this.props".

    interface HelloWorldProps {
        userName?: string; // Question mark indicates prop is optional
    }

    class HelloWorld extends RX.Component<HelloWorldProps, void> {
        render() {
            return (
                <RX.Text>
                    { 'Hello ' + (this.props.userName || 'World') }
                </RX.Text>
            );
        }
    }

## Styles
The example above renders a string using default styles (font, size, color, etc.). You can override style defaults by specifying a "style" prop. In this example, we render bold text on a green background. Note that styles within React (and ReactXP) borrow heavily from CSS.

    // By convention, styles are created statically and referenced  
    // through a private (not exported) _styles object.
    const _styles = {
        container: RX.Styles.createViewStyle({
            backgroundColor: 'green'
        }),
        text: RX.Styles.createTextStyle({
            color: 'red',
            fontSize: 36, // Size in pixels
            fontWeight: 'bold'
        })
    };

    class HelloWorld extends RX.Component<void, void> {
        render() {
            return (
                <RX.View style={ _styles.container }>
                    <RX.Text style={ _styles.text }>
                        Hello World
                    </RX.Text>
                </RX.View>
            );
        }
    }

For more details about style attributes, refer to the [styles](/reactxp/docs/styles.html) documentation or the documentation for each component.

## Layout Directives

React uses flexbox directives for component layout. These directives are specified along with styling information. A number of flexbox tutorials are available online. [Here](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) is one we especially recommend. Using flexbox directives, you can specify the primary layout direction (row or column), justification, alignment, and spacing. 

React also adopts the notion of margin and padding from CSS. Margin is the amount of space around a component, and padding is the amount of space between the boundary of the component and its children.

Here is an example style that incorporates margin, padding and flexbox directives.

    const _styles = {
        container: RX.Styles.createViewStyle({
            flexDirection: 'column',
            flexGrow: 1,
            flexShrink: 1,
            alignSelf: 'stretch',
            justifyContent: 'center',
            margin: 4,
            padding: 4,
            backgroundColor: 'green'
        })
    };

For more details about layout directives, refer to the [styles](/reactxp/docs/styles.html) documentation.

## Event Handling

Events, such as user gestures, key presses or mouse actions, are reported by way of event-handler callbacks that are specified as props. In this example, the component registers an onPress callback for a button.

    class CancelButton extends RX.Component<void, void> {
        render() {
            return (
                <RX.Button onPress={ this._onPress }>
                    Cancel
                </RX.Button>
            );
        }

        private _onPress = (e: RX.SyntheticEvent) => {
            e.stopPropagation();

            // Cancelation logic goes here.
        }
    }

This example makes use of a TypeScript lambda function to bind the _onPress variable to the method instance at class creation time. It also demonstrates a few conventions (use of the variable name "e" to represent the event object and a method name beginning with an underscore to indicate that it's private). It also demonstrates a best practice (calling the stopPropagation method to indicate that the event was handled).

## State

As we saw in the examples above, a component's appearance and behavior can change based on externally-provided props. It can also change based on its own internally-managed state. As a simple example, the visual style may change when a user mouses over the component.

React components can define a *state* object. When this object is updated through the use of the *setState* method, the component's render method is automatically called. In the example below, we implement a simple stop light with two states. Depending on the current state, the light is drawn in red or green. A press or click toggles the state.

    interface StopLightState {
        // Fields within a state object are usually defined as optional
        // (hence the question mark below) because calls to setState 
        // typically update only a subset of the fields.
        isStopped?: boolean;
    }

    const _styles = {
        redButton: RX.Styles.createViewStyle({
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'red'
        }),
        greenButton: RX.Styles.createViewStyle({
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'green'
        })
    };

    class StopLight extends RX.Component<void, StopLightState> {
        getInitialState(): StopLightState {
            return { isStopped: true };
        }

        render() {
            // Choose the appropriate style for the current state.
            var buttonStyle = this.state.isStopped ? 
                _styles.redButton : _styles.greenButton;

            return (
                <RX.Button style={ buttonStyle } 
                    onPress={ this._onToggleState } />
            );
        }

        private _onToggleState = (e: RX.MouseEvent) => {
            e.stopPropagation();

            // Flip the value of "isStopped" and re-render.
            this.setState({ isStopped: !this.state.isStopped });
        }
    }

Component state can also be stored as instance variables defined by the class. However, if a piece of data is used by the render method, it is better to add it to the state object and update it through the use of a setState call. That way, the rendered component will always reflect the current state.

