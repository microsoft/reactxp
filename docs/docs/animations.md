---
id: animations
title: Animations
layout: docs
category: Overview
permalink: docs/animations.html
next: accessibility
---

ReactXP supports a powerful animation abstraction. Inidividual style elements (e.g. transforms, opacity, or backgroundColor) can be animated. 

## Animatable Components

Three base RX classes can have animatable styles:

* Animated.View

* Animated.Image

* Animated.Text

These component types should be used in place of the normal [View](components/view), [Image](components/image), [Text](components/text) or [TextInput](components/textinput) in the render method. In general, style properties expressed as numeric values or colors can be animated. Properties with text values (e.g. flexDirection or fontWeight) cannot be animated. 

## Animated Values
The following example shows how to create animated values with an initial value. Animated values are typically stored as instance variables within a component class. They can also be stored in the state structure.

``` javascript
let animatedOpacityValue = new RX.Animated.Value(1.0);
let animatedScaleValue = new RX.Animated.Value(1.0);
```

## Animated Styles
Once an animated value is created, it can be associated with an animated style. 

Some animated style values are more expensive than others. Some affect the layout of elements (e.g. width, height, top, left), so the layout engine needs to be invoked during each stage of the animations. It's faster to avoid these and stick to styles that don't affect the layout (e.g. opacity and transforms).

This example demonstrates how a style sheet can contain multiple animated values.
``` javascript
let animatedStyle = RX.Styles.createAnimatedViewStyle({
    opacity: animatedOpacityValue,
    transform: [{
        scale: animatedScaleValue
    }]
});
```

Animated style sheets can be combined with other static styles.
``` javascript
render() {
    <RX.Animated.View style={ [_styles.staticStyle, animatedStyle] } />
}
```

## Simple Timing Animations
To describe an animation, specify the final value of the animated value and a duration (specified in milliseconds). An optional easing function allows for a variety of animation curves including linear, step-wise, and cubic bezier.

Once an animation is defined, a call to the start() method starts the animation. The start method takes an optional parameter, a callback that is executed when the animation completes.

``` javascript
let opacityAnimation = RX.Animated.timing(animatedScaleValue,
    { toValue: 0.0, duration: 250, easing: RX.Animated.Easing.InOut() }
);

opacityAnimation.start(() => this._doSomethingWhenAnimationCompletes());
```

## Composite Animations
Sometimes it's useful to execute multiple animations in parallel or in sequence. This is easily accommodated by calling RX.Animated.parallel() or RX.Animated.sequence(). Composite animations can be nested to create sophisticated sequences.

``` javascript
let compositeAnimation = RX.Animated.parallel([
    RX.Animated.timing(animatedScaleValue,
        { toValue: 0.0, duration: 250, easing: RX.Animated.Easing.InOut() }
    ),
    RX.Animated.timing(animatedOpacityValue,
        { toValue: 1.1, duration 250, easing: RX.Animated.Easing.Linear() }
    )
]);

compositeAnimation.start();
```
