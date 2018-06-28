/**
* TodoModels.tsx
* Copyright: Microsoft 2018
*
* Data models used with Todo sample app.
*/

export interface Todo {
    id: string;
    creationTime: number;
    text: string;
    _searchTerms: string;
}
