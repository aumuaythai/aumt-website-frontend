var admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://aumt-website.firebaseio.com"
});


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
// DELETE MULTIPLE USERS
// ============

const uidArray = ['<uid1>', '<uid2>', '<uid3>']
admin.auth().deleteUsers(uidArray)
    .then(function(deleteUsersResult) {
      console.log('Successfully deleted ' + deleteUsersResult.successCount + ' users');
      console.log('Failed to delete ' +  deleteUsersResult.failureCount + ' users');
      deleteUsersResult.errors.forEach(function(err) {
        console.log(err.error.toJSON());
      });
    })
    .catch(function(error) {
      console.log('Error deleting users:', error);
    });
  
