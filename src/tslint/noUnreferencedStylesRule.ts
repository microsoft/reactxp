/**
* noUnreferencedStylesRule.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom tslint rule used to enforce that there are no unfreferenced
* entries in a static array named "_styles".
*
* To enable this rule, add the following line to your tslint.json:
*   "no-unreferenced-styles": true
*/

import * as _ from 'lodash';
import { RuleFailure, Rules, RuleWalker } from 'tslint';
import * as ts from 'typescript';

const STYLES_NOT_CONST = 'Styles array is not marked const';
const STYLE_NOT_REFERENCED = 'Unreferenced style ';

export class Rule extends Rules.AbstractRule {
    apply(sourceFile: ts.SourceFile): RuleFailure[] {
        const options = this.getOptions();
        const stylesWalker = new StylesWalker(sourceFile, options);
        return this.applyWithWalker(stylesWalker);
    }
}

interface StyleInfo {
    isReferenced: boolean;
    start: number;
    width: number;
}

class StylesWalker extends RuleWalker {
    private _definedStyles: { [name: string]: StyleInfo } = {};

    walk(node: ts.Node): void {
        super.walk(node);

        this._reportUnreferencedStyles();
    }

    visitVariableDeclaration(node: ts.VariableDeclaration) {
        // Is this a _styles node?
        if (node.name.getText() === '_styles' && node.initializer) {
            const nodeFlags = ts.getCombinedNodeFlags(node);

            // All styles should be const.
            if ((nodeFlags & ts.NodeFlags.Const) === 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), STYLES_NOT_CONST));
            }

            // Add known styles recursively.
            this._addKnownStyles(node.initializer, '_styles.');
        }
    }

    private _addKnownStyles(node: ts.Node, prefix: string): boolean {
        let hasChildren = false;

        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            const objLiteral = node as ts.ObjectLiteralExpression;

            if (objLiteral.properties) {
                _.each(objLiteral.properties, property => {
                    const nodeName = prefix + property.name!.getText();

                    // Recurse to pick up any nested style types.
                    const children = property.getChildren();
                    let childHasChildren = false;
                    _.each(children, child => {
                        if (this._addKnownStyles(child, nodeName + '.')) {
                            childHasChildren = true;
                        }
                    });

                    // Don't add the node if it's just a container for
                    // other styles.
                    if (!childHasChildren) {
                        this._definedStyles[nodeName] = {
                            isReferenced: false,
                            start: property.getStart(),
                            width: property.getWidth()
                        };
                    }

                    hasChildren = true;
                });
            }
        }

        return hasChildren;
    }

    visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        this._markReferencedStyles(node.getText());
    }

    visitConstructorDeclaration(node: ts.ConstructorDeclaration) {
        this._markReferencedStyles(node.getText());
    }

    visitMethodDeclaration(node: ts.MethodDeclaration) {
        this._markReferencedStyles(node.getText());
    }

    visitArrowFunction(node: ts.FunctionLikeDeclaration) {
        this._markReferencedStyles(node.getText());
    }

    visitPropertyDeclaration(node: ts.PropertyDeclaration) {
        this._markReferencedStyles(node.getText());
    }

    private _markReferencedStyles(functionText: string) {
        const stylesRegEx = /\_styles\.[\_\.a-zA-Z0-9]+/g;
        const matches = functionText.match(stylesRegEx);

        if (matches) {
            _.each(matches, match => {
                // Note that this style has been referenced.
                if (this._definedStyles[match] !== undefined) {
                    this._definedStyles[match].isReferenced = true;
                }
            });
        }
    }

    private _reportUnreferencedStyles() {
        _.each(this._definedStyles, (styleInfo, styleName) => {
            if (!styleInfo.isReferenced) {
                this.addFailure(this.createFailure(styleInfo.start, styleInfo.width,
                    STYLE_NOT_REFERENCED + styleName));
            }
        });
    }
}
