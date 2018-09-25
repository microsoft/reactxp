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
        alignItems: 'stretch'
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
    }),
    dragAndDropContainer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flex: 1,
        height: 70
    }),
    dragAndDropView: RX.Styles.createViewStyle({
        flex: 1,
        borderColor: CommonStyles.buttonBorderColor,
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    }),
    dragAndDropObject: RX.Styles.createViewStyle({
        height: 40,
        width: 40,
        backgroundColor: CommonStyles.successTextColor,
        marginTop: 5
    })
};

interface DragAndDropViewState {
    isFileDragAndDropHover: boolean;
    logViewDragAndDrop: string[];
    filesDropped: FileInfo[];
    isViewDragAndDropHover: boolean;
    viewDragStartDateAndTime: string;
}

interface FileInfo {
    fileName: string;
    fileSize: number;
}

class DragAndDropView extends RX.Component<RX.CommonProps, DragAndDropViewState> {
    constructor(props: RX.CommonProps) {
        super(props);

        this.state = {
            isFileDragAndDropHover: false,
            logViewDragAndDrop: [],
            filesDropped: [],
            isViewDragAndDropHover: false,
            viewDragStartDateAndTime: ''
        };
    }

    render() {
        return (
            <RX.View style={ _styles.container}>
                <RX.View style={ _styles.textContainer } key={ 'explanation1' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Drag one or more files over to the container below' }
                    </RX.Text>
                </RX.View>
                <RX.View 
                    style={ [ _styles.labelContainer, this.state.isFileDragAndDropHover ? _styles.labelContainerHover : undefined ] }
                    onDragEnter={ this._onDragEnterForFiles }
                    onDragLeave={ this._onDragLeaveForFiles }
                    onDragOver={ this._onDragOverForFiles }
                    onDrop={ this._onDropForFiles }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Drop target' }
                    </RX.Text>
                </RX.View>

                { this._renderDroppedFiles() }

                <RX.View style={ _styles.textContainer } key={ 'explanation2' }>
                    <RX.Text style={ _styles.explainText }>
                        { 'Drag the square from the left side to the right side' }
                    </RX.Text>
                </RX.View>

                <RX.View style={ [ _styles.textContainer, _styles.dragAndDropContainer ] }>
                    <RX.View style={ [ _styles.dragAndDropView, _styles.explainText ] }>
                        <RX.View 
                            onDragStart={ this._onDragStartForViews }
                            style={ _styles.dragAndDropObject }
                            >
                        </RX.View>
                    </RX.View>
                    <RX.View style={ _styles.dragAndDropView }>
                        <RX.Text style={ _styles.explainText }>
                            { 'Not allowed to drop here' }
                        </RX.Text>
                    </RX.View>
                    <RX.View 
                        style={ [ _styles.dragAndDropView, this.state.isViewDragAndDropHover ? _styles.labelContainerHover : undefined ] }
                        onDragEnter={ this._onDragEnterForViews }
                        onDragLeave={ this._onDragLeaveForViews }
                        onDragOver={ this._onDragOverForViews }
                        onDrop={ this._onDropForViews }>
                        <RX.Text style={ _styles.explainText }>
                            { 'Drop target' }
                        </RX.Text>
                    </RX.View>
                </RX.View>

                { this._renderViewDragStart() }

            </RX.View>
        );
    }

    private _renderDroppedFiles(): JSX.Element | undefined {
        if (this.state.filesDropped.length === 0) {
            return undefined;
        }

        let filesInfo: JSX.Element[] = [];
        _.each(this.state.filesDropped, fileInfo => {
            filesInfo.push(this._formatFileInfo(fileInfo));
        });

        return (
            <RX.View style={ _styles.textContainer } key={ ' droppedFiles ' }>
                <RX.Text style={ _styles.explainText }>
                    { 'You dropped' }
                </RX.Text>
                { filesInfo }
            </RX.View>
        );
    }

    private _formatFileInfo(file: FileInfo): JSX.Element {
        return (
            <RX.Text key={ file.fileName } style={ _styles.explainText }>
                { file.fileName + ', size: ' + file.fileSize + 'kb' }
            </RX.Text>
        );
    }

    private _renderViewDragStart(): JSX.Element | undefined {
        if (this.state.viewDragStartDateAndTime === '') {
            return undefined;
        }

        return (
            <RX.View style={ _styles.textContainer } key={ ' droppedView ' }>
                <RX.Text style={ _styles.explainText } key={ 'drag' }>
                    { 'You started dragging at ' + this.state.viewDragStartDateAndTime }
                </RX.Text>
                <RX.Text style={ _styles.explainText } key={ 'drop' }>
                    { 'You dropped at ' + new Date().toLocaleTimeString() }
                </RX.Text>
            </RX.View>
        );
    }

    private _onDragEnterForFiles = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isFileDragAndDropHover: true
        });
    }

    private _onDragLeaveForFiles = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isFileDragAndDropHover: false
        });
    }

    private _onDragOverForFiles = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isFileDragAndDropHover: true
        });
    }

    private _onDropForFiles = (e: RX.Types.DragEvent) => {
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
            isFileDragAndDropHover: false,
            filesDropped: filesDropped
        });
    }

    private _onDragStartForViews = (e: RX.Types.DragEvent) => {
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.setData('transferData', new Date().toLocaleTimeString());
    }

    private _onDragEnterForViews = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isViewDragAndDropHover: true
        });
    }

    private _onDragLeaveForViews = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isViewDragAndDropHover: false
        });
    }

    private _onDragOverForViews = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isViewDragAndDropHover: true
        });
    }

    private _onDropForViews = (e: RX.Types.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            isViewDragAndDropHover: false,
            viewDragStartDateAndTime: e.dataTransfer.getData('transferData')
        });
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
