import * as docs from './document.SubmittedDocuments'
import * as importDoc from './import.SubmittedDocuments'
import * as downloadDoc from './Download.SubmittedDocuments'
import * as delDocs from './deleteDocument.SubmittedDocuments'
import * as docsImpress from './docsImpress.SubmittedDocuments'
import * as chartDocSub from './chartDocSub.SubmittedDocuments'

export const SubmittedDocumentsController = {
           ...docs,    
           ...importDoc,
           ...delDocs,
           ...downloadDoc,
           ...chartDocSub,
           ...docsImpress,
};