var admin = require('firebase-admin');


admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://aumt-website.firebaseio.com"
});

console.log(admin)

// ============
// UPDATE EMAIL
// ============

// admin.auth().updateUser('<uid>', // uid
//     {
//         email: '<new email>'
//     })
//     .then((res) => {
//         console.log('response', res)
//     })
//     .catch((err) => {
//         console.log(err)
//     })




// ============
// DELETE ALL USERS OTHER THAN SPECIFIED UIDS
// ============

// admin
    // .auth()
    // .listUsers(250)
    // .then((listUsersResult) => {
    //     allUids = []
    //     listUsersResult.users.forEach((userRecord) => {
    //     allUids.push(userRecord.toJSON().uid);
    //     });
    //     return allUids
    // })
    // .then((allUids) => {
    //     saveUids = [
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',
    //         '<uid-here>',

    //     ]
    //     deleteUids = allUids.filter(uid => saveUids.indexOf(uid) === -1)
    //     return deleteUids
    // })
    // .then((deleteUids) => {
    //     return admin.auth().deleteUsers(deleteUids).then((result) => {
    //         console.log('Successfully deleted ' + result.successCount + ' users');
//             console.log('Failed to delete ' +  result.failureCount + ' users');
//             result.errors.forEach(function(err) {
//                 console.log(err.error.toJSON());
//             });
//         })
//     })
//     .catch((error) => {
//       console.log('Error:', error);
//     });
 
// ============
// DELETE MULTIPLE USERS BY UID
// ============

// const uidArray = ['<uid1>', '<uid2>', '<uid3>']
// admin.auth().deleteUsers(uidArray)
//     .then(function(deleteUsersResult) {
//       console.log('Successfully deleted ' + deleteUsersResult.successCount + ' users');
//       console.log('Failed to delete ' +  deleteUsersResult.failureCount + ' users');
//       deleteUsersResult.errors.forEach(function(err) {
//         console.log(err.error.toJSON());
//       });
//     })
//     .catch(function(error) {
//       console.log('Error deleting users:', error);
//     });
  
