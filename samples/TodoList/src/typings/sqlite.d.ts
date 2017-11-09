//
// This file contains missing type definitions that should be part of
// nosqlprovider but are currently missing.
//

interface SQLTransactionCallback {
    (transaction: SQLTransaction): void;
}

interface SQLTransactionErrorCallback {
    (error: SQLError): void;
}

interface SQLError {
    code: number;
    message: string;
}

interface SQLResultSet {
    insertId: number;
    rowsAffected: number;
    rows: SQLResultSetRowList;
}

interface SQLResultSetRowList {
    length: number;
    item(index: number): any;
}

interface SQLStatementCallback {
    (transaction: SQLTransaction, resultSet: SQLResultSet): void;
}

interface SQLStatementErrorCallback {
    (transaction: SQLTransaction, error: SQLError): void;
}

interface SQLTransaction {
    executeSql(sqlStatement: string, args?: any[], callback?: SQLStatementCallback, errorCallback?: SQLStatementErrorCallback): void;
}


