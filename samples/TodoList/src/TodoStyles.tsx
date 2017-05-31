/**
* TodoStyles.tsx
* Copyright: Microsoft 2017
*
* Style used in the Todo application.
*/

import RX = require('reactxp');

class TodoStyles {
    static color = {
        black: '#000000',
        darkgreen: '#006400',
        darkorange: '#FF8C00',
        honeydew: '#F0FFF0',
        orange: '#FFA500',
        seagreen: '#2E8B57',
        gray: '#808080',
        black50: '#0000007F'
   };

    static controlColors = {
        defaultActionButtonColor: TodoStyles.color.black,
        saveActionButtonCollor: TodoStyles.color.darkgreen,
        destroyActionButtonCollor: TodoStyles.color.darkorange,
    };

    static buttonBorders = {
        radius: 16,
        margins: 16,
        defaultHeigh: 32,
        marging: 8
    }

    static fontSizes = {
        XXS: 5,
        XS:  10,
        S:   12,
        M:   16,
        L:   22,
        XL:  24,
        XXL: 36
    }

    static styles = {
        scroll: RX.Styles.createScrollViewStyle({
            paddingTop : 20,
            alignSelf: 'stretch',
            backgroundColor: TodoStyles.color.black50
        }),
        headerWithStatusBar: RX.Styles.createViewStyle({
            paddingTop: 22
        }),
        header: RX.Styles.createViewStyle({
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: TodoStyles.color.seagreen
        }),
        inputView: RX.Styles.createViewStyle({
            alignSelf: 'stretch',
            flex: 2,
            backgroundColor: TodoStyles.color.orange
        }),
        container: RX.Styles.createViewStyle({
            padding: 0,
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center'
        }),
        editTodoItem: RX.Styles.createTextStyle({
            padding: 8,
            fontSize: TodoStyles.fontSizes.XL,
            flex: 1,
            alignSelf: 'stretch',
            fontWeight: 'bold',
            marginBottom: 28
        }),
        welcome: RX.Styles.createTextStyle({
            fontSize: TodoStyles.fontSizes.M,
            marginBottom: 12
        }),
        todoListHeader: RX.Styles.createTextStyle({
            fontSize: TodoStyles.fontSizes.XXL,
            marginBottom: 12
        }),
        instructions: RX.Styles.createTextStyle({
            fontSize: TodoStyles.fontSizes.M,
            color: TodoStyles.color.black,
            marginBottom: 16
        }),
        docLink: RX.Styles.createLinkStyle({
            fontSize: TodoStyles.fontSizes.M,
            color: 'blue',
            marginBottom: 16,
            marginTop: 44
        }),
        roundButton: RX.Styles.createViewStyle({
            margin: 16,
            borderRadius: 16,
            backgroundColor: '#7d88a9'
        }),
        defaultRoundButton: RX.Styles.createViewStyle({
            margin: TodoStyles.buttonBorders.marging,
            height: TodoStyles.buttonBorders.defaultHeigh,
            borderRadius: TodoStyles.buttonBorders.radius,
            backgroundColor: TodoStyles.controlColors.defaultActionButtonColor
        }),
        saveRoundButton: RX.Styles.createViewStyle({
            margin: TodoStyles.buttonBorders.marging,
            height: TodoStyles.buttonBorders.defaultHeigh,
            borderRadius: TodoStyles.buttonBorders.radius,
            backgroundColor: TodoStyles.controlColors.saveActionButtonCollor
        }),
        buttonText: RX.Styles.createTextStyle({
            fontSize: TodoStyles.fontSizes.M,
            marginVertical: 6,
            marginHorizontal: 12,
            color: 'white'
        }),

        todoListcontainer: RX.Styles.createViewStyle({
            padding: 0,
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            alignSelf: 'stretch',
            alignItems: 'stretch'
        }),
        todoListScroll: RX.Styles.createViewStyle({
            flexDirection: 'column',
            alignSelf: 'stretch',
            backgroundColor: TodoStyles.color.honeydew
        }),
        todoListItemCell: RX.Styles.createViewStyle({
            flex : 1,
            borderBottomWidth : 0.5,
            backgroundColor: TodoStyles.color.honeydew
        }),
        todoListItemText: RX.Styles.createTextStyle({
            fontSize: TodoStyles.fontSizes.XL,
            marginVertical: 2,
            marginHorizontal: TodoStyles.buttonBorders.marging,
            alignSelf: 'stretch',
            color: TodoStyles.color.darkgreen
        })
    };

}

export = TodoStyles;
