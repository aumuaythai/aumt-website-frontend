import firebase from 'firebase/app';
import 'firebase/functions';

class Functions {
    private functions: firebase.functions.Functions;

    constructor() {
        firebase.functions().useEmulator('localhost', 5001)
        this.functions = firebase.functions();
    }

    removeMember(): firebase.functions.HttpsCallable {
        return this.functions.httpsCallable('removeUser');
    }

}

export default new Functions();