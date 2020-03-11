import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as serviceAccount from './service';

const params = {
  type: serviceAccount.service.type,
  projectId: serviceAccount.service.project_id,
  privateKeyId: serviceAccount.service.private_key_id,
  privateKey: serviceAccount.service.private_key,
  clientEmail: serviceAccount.service.client_email,
  clientId: serviceAccount.service.client_id,
  authUri: serviceAccount.service.auth_uri,
  tokenUri: serviceAccount.service.token_uri,
  authProviderX509CertUrl: serviceAccount.service.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.service.client_x509_cert_url
}
   
firebase.initializeApp({
  credential: firebase.credential.cert(params),
})
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const usermanagement = functions.https.onRequest((request, response) => {
  // response.send({request:request.body})
  /** 
   * Create User For Member
   */
  if (request.body.type == 1) {
    firebase.auth().createUser({
      phoneNumber:"+62"+request.body.data.phone.substring(1),
      email: request.body.data.email.toLowerCase(),
      emailVerified: true,
      password: request.body.data.email,
      displayName: request.body.data.nama,
      disabled: false
  }).then(function(result) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', result.uid+' console : '+request.headers["content-type"]);
      response.send({success:1,name:result.displayName,uid:result.uid});
    })
    .catch(function(error) {
      console.log('Error creating new user:', error);
      response.send({error:error,success:0});
    });
    /**
     * Create User For Guru
     */
  }else if(request.body.type == 2){
      firebase.auth().createUser({
        email: request.body.data.email.toLowerCase(),
        emailVerified: true,
        password: request.body.data.nip,
        displayName: request.body.data.name,
        disabled: false
    }).then(function(result) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', result.uid+' console : '+request.headers["content-type"]);
        response.send({success:1,name:result.displayName,uid:result.uid});
      })
      .catch(function(error) {
        console.log('Error creating new user:', error);
        response.send({error:error,success:0});
      });
      /**
       * Delete User
       */
  }else if(request.body.type == 3){
      firebase.auth().deleteUser(request.body.key).then(function(result){
        console.log(result);
        response.send({success:1});
      }).catch(function(error){
        console.log(error);
        response.send({success:0});
      })
  }else if(request.body.type == 4){
      firebase.auth().createUser({
        email: request.body.data.email_sebagai.toLowerCase(),
        emailVerified: true,
        password: request.body.data.nisn,
        displayName: request.body.data.nama_sebagai,
        phoneNumber:"+62"+request.body.data.telp_sebagai.substring(1),
        disabled: false
    }).then(function(result) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully created new user:', result.uid+' console : '+request.headers["content-type"]);
        response.send({success:1,name:result.displayName,uid:result.uid});
      })
      .catch(function(error) {
        console.log('Error creating new user:', error);
        response.send({error:error,success:0});
      });
  }else if(request.body.type == 5){
    firebase.auth().generatePasswordResetLink(request.body.data.email).then(function(result){
      console.log('Successfully send reset link password')
      response.send({success:1,msg:'Successfully send reset link password, Check Your Email'});
    }).catch(function(error){
      console.log({error:error,success:0})
      response.send({error:error,success:0})
    })
  }

});
