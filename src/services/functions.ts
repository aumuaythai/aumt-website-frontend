import firebase from "firebase/app";
import "firebase/functions";

import {HttpsCallableResult} from "@firebase/functions-types";

class Functions {
    private functions: firebase.functions.Functions | null = null;

    public initialize() {
        if (!this.functions) {
            firebase.functions().useEmulator("localhost", 5001);
            this.functions = firebase.functions();
        }
    }

    public isAdmin(): Promise<HttpsCallableResult> {
        if (!this.functions) return Promise.reject("No db object");
        const call = this.functions.httpsCallable("checkUserIsAdmin");
        return call({});
    }

    public removeUser(uid: string): Promise<HttpsCallableResult> {
        if (!this.functions) return Promise.reject("No db object");
        const call = this.functions.httpsCallable("removeUser");
        return call({ uid: uid });
    }
}

export default new Functions();
