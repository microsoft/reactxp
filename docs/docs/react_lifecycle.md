---
id: react_lifecycle
title: Component Lifecycle
layout: docs
category: Overview
permalink: docs/react_lifecycle.html
next: react_stores
---
## Virtual DOM

As we learned from previous examples, a component's *render* method returns a tree of component specs. The React framework converts these specs into actual DOM elements (in the case of React JS) or native controls (in the case of React Native).

We also saw in previous examples that the render method is called every time the props change or the internal state is modified through the setState method. It would be very inefficient if every one of these changes resulted in the deallocation and re-allocation of a DOM element or native control. React avoids this overhead by allocating the DOM element or control the first time it appears in the component spec tree and deallocating it only when it no longer appears in the spec tree. Any other changes result in lightweight updates.

How does React know whether a component instance already exists -- or whether it requires updating? It makes use of a *virtual DOM*, a cached instance of the component spec tree. Using simple differencing logic, it efficiently determines whether nodes within this tree need to be added, removed, or updated (when props change).

## Keys

Lists of components present an interesting challenge for React's tree diffing approach. How can the diffing algorithm efficiently detect the case where a component is moved to a new location in the list? This is done through the use of *keys*. A key is a string that uniquely identifies a component instance from other components in a list. A key must be specified by the render method any time a list child components of the same type are returned.

In this example, a UserInfoCard component is rendered for each user in a list. Each UserInfoCard instance is given a key based on a unique ID corresponding to each user.

    render() {
        var users = _.map(this.state.userList, user => {
            return (
                <UserInfoCard
                    key={ user.id }
                    user={ user }
                >
            );
        });

        return (
            <RX.View>
                { users }
            </RX.View>
        );
    }

## Mounting & Unmounting

When React encounters a component spec that has no corresponding node in the current virtual DOM, it inserts the spec into the virtual DOM. It also allocates a corresponding DOM element (in the case of React JS) or native control (in the case of React Native). This is referred to as *mounting* a component. Likewise, when a component instance is removed from the real DOM or native control hierarhcy, it is said to be *unmounted*. Certain methods, such as *setState*, can be called only while a component is mounted.

The React.Component base class, from which all components derive, defines several methods that are called immediately before and after a component is mounted and before a component is unmounted. Component classes can override these methods if desired. For example, if you want to set the focus to a text input box, this can be done within the componentDidMount method.

    protected componentWillMount();
    protected componentDidMount();
    protected componentWillUnmount();

## Updating

A previously-mounted component can be updated in one of two ways -- through modification of its props or its state. By default, React performs a deep comparison of props and state to determine whether they have changed. Components may override this behavior to provide optimized comparison logic based on more detailed knowledge about the component.

    protected shouldComponentUpdate(nextProps: P, nextState: S);

Once it is determined that a component should be updated, it is informed before and after the update.

    protected componentWillReceiveProps(props: P);
    protected componentWillUpdate(nextProps: P, nextState: S);
    protected componentDidUpdate(prevProps: P, prevState: S);
