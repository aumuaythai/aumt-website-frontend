import * as firebase from 'firebase'
class DB {
    private database: firebase.database.Database |  null = null;

    public initialize = () => {
        if (!this.database) {
            this.database = firebase.database()

        }
    }

    // all database interaction methods go here (or sibling files)
}

export default new DB()