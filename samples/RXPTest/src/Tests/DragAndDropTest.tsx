/*
* Tests the Drag and Drop in an interactive manner.
*/

import _ = require('lodash');
import RX = require('reactxp');

import * as CommonStyles from '../CommonStyles';
import { Test, TestType } from '../Test';

const _styles = {
    container: RX.Styles.createViewStyle({
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'flex-start'
    }),
    textContainer: RX.Styles.createViewStyle({
        margin: 12
    }),
    labelContainer: RX.Styles.createViewStyle({
        alignSelf: 'stretch',
        margin: 8,
        borderColor: CommonStyles.buttonBorderColor,
        borderStyle: 'solid',
        borderWidth: 1,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center'
    }),
    labelContainerHover: RX.Styles.createViewStyle({
        backgroundColor: CommonStyles.buttonBorderColor
    }),
    explainText: RX.Styles.createTextStyle({
        fontSize: CommonStyles.generalFontSize,
        color: CommonStyles.explainTextColor
    })
};

interface DragAndDropViewState {
    logFileDragAndDrop: string[];
    isFileDragAndDropHover: boolean;
    logViewDragAndDrop: string[];
    filesDropped: FileInfo[];
}

interface FileInfo {
    fileName: string;
    fileSize: number;
}

class DragAndDropView extends RX.Component<RX.CommonProps, DragAndDropViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            logFileDragAndDrop: [],
            isFileDragAndDropHover: false,
            logViewDragAndDrop: [],
            filesDropped: []
        };
    }

    render() {
        let filesInfo: JSX.Element[] = [];
        if (this.state.filesDropped) {
            _.each(this.state.filesDropped, fileInfo => {
                filesInfo.push(this._formatFileInfo(fileInfo));
            });            
        }

        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Drag a file (more files) over to the container below' }
                    </RX.Text>
                </RX.View>
                <RX.View style={ [ _styles.labelContainer, this.state.isFileDragAndDropHover ? _styles.labelContainerHover : undefined ] }
                    onDragEnter={ this._onDragEnter }
                    onDragLeave={ this._onDragLeave }
                    onDragOver={ this._onDragOver }
                    onDrop={ this._onDrop }>
                    <RX.Text style={ _styles.explainText }>
                        { this.state.isFileDragAndDropHover ? 'Drop target' : 'Drag and drop target'}
                    </RX.Text>
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ ' droppedFiles ' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'You dropped' }
                    </RX.Text>
                    { filesInfo }
                </RX.View>

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Drag the view from the left side to the right side' }
                    </RX.Text>
                </RX.View>
            </RX.View>
        );
    }

    private _onDragEnter = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            logFileDragAndDrop: this.state.logFileDragAndDrop.concat('onDragEnter'),
            isFileDragAndDropHover: true
        });
    }

    private _onDragLeave = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            logFileDragAndDrop: this.state.logFileDragAndDrop.concat('onDragLeave'),
            isFileDragAndDropHover: false
        });
    }

    private _onDragOver = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            logFileDragAndDrop: this.state.logFileDragAndDrop.concat('onDragOver'),
            isFileDragAndDropHover: true
        });
    }

    private _onDrop = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        let filesDropped: FileInfo[] = [];
        _.each(e.dataTransfer.files, fileData => {
            const fileInfo: FileInfo = {
                fileName: fileData.name,
                fileSize: Math.round(fileData.size / 1024)
            };

            filesDropped.push(fileInfo);
        });

        this.setState({
            logFileDragAndDrop: this.state.logFileDragAndDrop.concat('onDrop'),
            isFileDragAndDropHover: false,
            filesDropped: filesDropped
        });
    }

    private _formatFileInfo(file: FileInfo): JSX.Element {
        return (
        <RX.Text key={ file.fileName } style={ _styles.explainText }>
            { file.fileName + ', size: ' + file.fileSize + 'kb' }
        </RX.Text>
        );
    }
}

class DragAndDropTest implements Test {
    getPath(): string {
        return 'APIs/DragAndDrop';
    }

    getTestType(): TestType {
        return TestType.Interactive;
    }

    render(onMount: (component: any) => void): RX.Types.ReactNode {
        return (
            <DragAndDropView
                ref={ onMount }
            />
        );
    }
}

export default new DragAndDropTest();
