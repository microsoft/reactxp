/**
* groupedImportRule.ts
*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*
* Custom tslint rule used to ensure we don't group ambient (non-relative)
* module imports with relative module imports.
*
* To enable, include the following line in tslint.json:
*   "grouped-import": true
*/

import { RuleFailure, Rules, RuleWalker } from 'tslint';
import * as tsutils from 'tsutils';
import * as ts from 'typescript';

export class Rule extends Rules.AbstractRule {
    static FAILURE_STRING_PART = 'Ambient and relative imports must be separated';

    apply(sourceFile: ts.SourceFile): RuleFailure[] {
        const options = this.getOptions();
        const banModuleWalker = new GroupedImportModuleWalker(sourceFile, options);
        return this.applyWithWalker(banModuleWalker);
    }
}

enum ImportType {
    None,
    Relative,
    Ambient
}

class GroupedImportModuleWalker extends RuleWalker {
    private _inImportGroup = false;
    private _lastImportType = ImportType.None;

    visitNode(node: ts.Node) {
        if (tsutils.isImportDeclaration(node) || tsutils.isImportEqualsDeclaration(node)) {
            // If last line was linebreak, we're in a new block.
            const prevStatement = tsutils.getPreviousStatement(node);
            const prevLineNum = prevStatement ? ts.getLineAndCharacterOfPosition(this.getSourceFile(), prevStatement.end).line : -1;
            const currentLineNum = ts.getLineAndCharacterOfPosition(this.getSourceFile(), node.end).line;
            if (prevLineNum !== -1 && prevLineNum < currentLineNum - 1) {
                this._lastImportType = ImportType.None;
                this._inImportGroup = false;
            }

            const wasInImportGroup = this._inImportGroup;
            this._inImportGroup = true;
            const importType = this._checkImportType(node);
            if (wasInImportGroup && importType !== this._lastImportType) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_PART));
            }
            this._lastImportType = importType;
        } else {
            this._inImportGroup = false;
            this._lastImportType = ImportType.None;
            super.visitNode(node);
        }
    }

    private _checkImportType(node: ts.ImportEqualsDeclaration | ts.ImportDeclaration): ImportType {
        let modulePath: string | undefined;
        if (tsutils.isImportEqualsDeclaration(node)) {
            if (node.moduleReference.kind === ts.SyntaxKind.ExternalModuleReference) {
                const matches = node.moduleReference.getFullText().match(/require\s*\(\s*'([^']+)'\s*\)/);
                if (matches && matches.length === 2) {
                    modulePath = matches[1];
                } else {
                    console.log('Unknown Missed Regex: ' + node.moduleReference.kind + '/' + node.moduleReference.getFullText());
                }
            }
        }

        if (tsutils.isImportDeclaration(node)) {
            modulePath = node.moduleSpecifier.getText().replace(/'/g, '');
        }

        if (modulePath) {
            // Assume that "@" is a shortcut for a relative path.
            if (modulePath[0] === '.' || modulePath[0] === '@') {
                return ImportType.Relative;
            } else {
                return ImportType.Ambient;
            }
        }

        return ImportType.None;
    }
}
