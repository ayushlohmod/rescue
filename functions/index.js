const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')
admin.initializeApp()
const backend_routes = express()
backend_routes.use(cors({ origin: true }))

backend_routes.get('/isUserAdmin', isUserAdmin)
backend_routes.post('/setUserAdmin', setUserAdmin)

function setUserAdmin(req, res) {
  console.log(
    '\nReceived request to setUserAdmin:\n',
    req.query.id,
    req.query.admin
  )
  const new_admin_value = req.query.admin === 'true' ? true : false
  return admin
    .auth()
    .getUser(req.query.id)
    .then(user => {
      console.log('got user')
      return admin
        .auth()
        .setCustomUserClaims(user.uid, {
          admin: new_admin_value,
        })
        .then(data => {
          console.log('successfully created new admin', data)
          res.send({ id: req.query.id, admin: new_admin_value })
        })
        .catch(e => {
          console.log('error creating new admin:', e)
          res.send({ error: e })
        })
    })
    .catch(e => console.log('could not find user:', e))
}

function isUserAdmin(req, res) {
  console.log('\nReceived request to isUserAdmin:\n', req.query.id)
  admin
    .auth()
    .getUser(req.query.id)
    .then(userRecord => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(
        `Successfully fetched user data:`,
        userRecord,
        userRecord.customClaims
      )
      res.send(userRecord.customClaims ? userRecord.customClaims.admin : false)
    })
    .catch(error => {
      console.log('Error fetching user data:', error)
      res.send('could not find user')
    })
}

exports.backend = functions.https.onRequest(backend_routes)
