import * as firebase from 'firebase'

export class DB {
    private database: firebase.database.Database;
    
    constructor() {
        this.database = firebase.database();
        console.log(this.database)
    }

    // all database interaction methods go here (or sibling files)
}