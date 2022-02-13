const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://aumt-website.firebaseio.com",
});

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

exports.isAdmin = functions.https.onCall((data, context) => {
    if (isAdmin(data, context)) {
        return { message: "You are an admin" };
    } else {
        return { message: "You are not an admin" };
    }
});

exports.removeUser = functions.https.onCall((data, context) => {
    if (isAdmin(data, context)) {
        admin
            .auth()
            .deleteUser(data.uid)
            .then((result) => {
                return { message: `User ${data.uid} deleted successfully from auth` };
            })
            .catch((error) => {
                return { message: `Error deleting user ${data.uid} from auth` };
            });
    } else {
        return { message: "Non-admins cannot make this request" };
    }
});

const isAdmin = (data, context) => {
    admin
        .firestore()
        .collection("admin")
        .doc(context.auth.uid)
        .get()
        .then((document) => {
            if (document.exists) return true;
            else return false;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });
};
