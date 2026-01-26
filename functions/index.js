const { logger } = require('firebase-functions')
const { onRequest, onCall, HttpsError } = require('firebase-functions/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getAuth } = require('firebase-admin/auth')

initializeApp()

const db = getFirestore()

async function requireAdmin(request) {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be logged in')
  }

  const adminDoc = await db.collection('admin').doc(request.auth.uid).get()
  if (!adminDoc.exists) {
    throw new HttpsError('permission-denied', 'Must be an admin')
  }
}

exports.deleteUser = onCall(async (request) => {
  await requireAdmin(request)

  const { uid } = request.data

  if (!uid) {
    throw new HttpsError('invalid-argument', 'User ID is required')
  }

  try {
    await getAuth().deleteUser(uid)
    logger.info(`Admin ${request.auth.uid} deleted user: ${uid}`)
    return { success: true, message: `User ${uid} deleted successfully` }
  } catch (error) {
    logger.error(`Error deleting user ${uid}:`, error)
    throw new HttpsError('internal', `Failed to delete user: ${error.message}`)
  }
})

exports.deleteAllUsers = onCall(async (request) => {
  await requireAdmin(request)

  try {
    const adminSnapshot = await db.collection('admin').get()
    const adminUids = new Set(adminSnapshot.docs.map((doc) => doc.id))

    const listResult = await getAuth().listUsers(1000)
    const usersToDelete = listResult.users
      .filter((user) => !adminUids.has(user.uid))
      .map((user) => user.uid)

    if (usersToDelete.length > 0) {
      await getAuth().deleteUsers(usersToDelete)
    }

    logger.info(
      `Admin ${request.auth.uid} deleted ${usersToDelete.length} users`
    )
    return { success: true, deletedCount: usersToDelete.length }
  } catch (error) {
    logger.error('Error deleting all users:', error)
    throw new HttpsError('internal', `Failed to delete users: ${error.message}`)
  }
})
