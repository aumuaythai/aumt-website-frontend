import * as firebase from 'firebase'
class DB {
    private db: firebase.database.Database |  null = null;

    public initialize = () => {
        if (!this.db) {
            this.db = firebase.database()

        }
    }

    // all database interaction methods go here (or sibling files)
}

export default new DB()