import hubCrypto from "../../../lib/hubCrypto";
import cryptoTools from "../../../lib/cryptoTools";
import inviteController from "../../../lib/controllers/inviteController";

Template.loginForm.helpers({
    //add you helpers here
    loginComplete: function () {
        return Template.instance().loginComplete.get()
    }
});

Template.loginForm.events({
    //add your events here
    'submit #loginForm ': function (event, instance) {
        event.preventDefault()

        let username = $('#loginUsername').val();
        let password = $('#loginPassword').val()
        //on soumet le login
        instance.loginComplete.set([
            'Récupération et déchiffrement de la clef privée',
            'Initialisation d\'une nouvelle session chiffrée'
        ])
        Meteor.loginWithPassword(username, password, function (error) {
            // si il y a une erreur, on "toast" le message d'erreur

            if (error) {
                Materialize.toast(error.message, 6000, 'red')();
            } else {

                cryptoTools.hash(password, (hashedPassword) => {
                  Meteor.subscribe("UserPrivateInfo", Meteor.userId(),()=>{
                      window.localStorage.setItem('hashedPassword', hashedPassword)
                      hubCrypto.initCryptoSession(hashedPassword, username, () => {

                          let invitationId= FlowRouter.current().queryParams.invitationId
                          let invitationPassword = FlowRouter.current().queryParams.password
                          if(invitationId && invitationPassword ){
                              inviteController.acceptInvitationId(invitationId,invitationPassword,(projectId)=>{
                                  hubCrypto.decryptAndStoreProjectListInSession(()=>{
                                      console.log(projectId)
                                      FlowRouter.go('/project/'+projectId+"/home")
                                      Materialize.toast("Bienvenue sur System-D", 6000, 'light-bg')
                                      Materialize.toast(__('loginPage.invitationAccepted'), 6000, 'light-bg')
                                  })

                              })
                          }else{
                              FlowRouter.go('/')
                              Materialize.toast("Bienvenue sur System-D", 6000, 'light-bg')
                          }
                      })
                  })

                })
            }
            // hubCrypto.initCryptoSession(password,username, ()=>{
            //
            // })
        })
    }
});

Template.loginForm.onCreated(function () {
    //add your statement here
    this.loginComplete = new ReactiveVar(undefined)
});

Template.loginForm.onRendered(function () {

});

Template.loginForm.onDestroyed(function () {
    //add your statement here
});

