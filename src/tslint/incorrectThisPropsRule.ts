/**
* incorrectThisPropsRule.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom tslint rule used to find cases where the code references
* this.props rather than props in the _buildState method and other
* methods that take an input parameter called "props".
*
* To enable, add the following line to your tslint.json file:
*       "incorrect-this-props": true
*/

import * as _ from 'lodash';
import { RuleFailure, Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';

const THIS_PROPS_REFERENCED = '"this.props" referenced within method that takes "props" input parameter.' +
    ' In most cases this is a mistake and you want to use "props",' +
    ' if you are sure you need this.props - use "const oldProps = this.props;"';
const THIS_PROPS = 'this.props';
const ALLOWED_OLD_PROPS = 'oldProps = ' + THIS_PROPS;

export class Rule extends Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): RuleFailure[] {
        const options = this.getOptions();
        const thisPropsWalker = new ThisPropsWalker(sourceFile, options);
        return this.applyWithWalker(thisPropsWalker);
    }
}

class ThisPropsWalker extends RuleWalker {
    walk(node: ts.Node): void {
        super.walk(node);
    }

    visitMethodDeclaration(node: ts.MethodDeclaration) {
        const hasPropsParam = _.find(node.parameters, param => {
            const paramNameIdentifier = param.name as ts.Identifier;
            return (paramNameIdentifier && paramNameIdentifier.text === 'props');
        });

        if (hasPropsParam) {
            const methodText = node.getText();
            let searchOffset = 0;

            while (true) {
                const foundOffset = methodText.indexOf(THIS_PROPS, searchOffset);
                if (foundOffset < 0 || foundOffset >= methodText.length) {
                    break;
                }

                // See if this is an allowed case ('oldProps = this.props').
                const allowedOffset = foundOffset + THIS_PROPS.length - ALLOWED_OLD_PROPS.length;
                if (allowedOffset >= 0 && methodText.indexOf(ALLOWED_OLD_PROPS, allowedOffset) === allowedOffset) {
                    searchOffset = foundOffset + THIS_PROPS.length;
                    continue;
                }

                // We found a disallowed instance of 'this.props' within a method that has
                // a 'props' input parameter. Flag it as an error.
                this.addFailure(this.createFailure(node.name.getStart() + foundOffset,
                    THIS_PROPS.length, THIS_PROPS_REFERENCED));
                searchOffset = foundOffset + THIS_PROPS.length;
            }
        }
    }
}
