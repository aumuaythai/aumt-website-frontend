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

exports.isAdmin = functions.https.onCall(async (data, context) => {
    if (isAdmin(data, context)) {
        return { message: "You are an admin" };
    } else {
        return { message: "You are not an admin" };
    }
});

exports.removeUser = functions.https.onCall(async (data, context) => {
    if (isAdmin(data, context)) {
        try {
            await admin.auth().deleteUser(data.uid);
            return { message: `User ${data.uid} deleted from auth` };
        } catch (error) {
            return { message: `User ${data.uid} could not be deleted from auth` };
        }
    } else {
        return { message: "Non-admins cannot make this request" };
    }
});

const isAdmin = async (data, context) => {
    try {
        await admin.firestore().collection("admin").doc(context.auth.uid).get();
        return true;
    } catch (error) {
        return false;
    }
};
