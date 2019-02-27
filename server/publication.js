import User from '/imports/classes/User';
import Project from "../imports/classes/Project";
import Projects from "../lib/collections/Projects";
import Invitation from "../imports/classes/Invitation";
import cryptoServer from "../imports/cryptoServer";
import Invitations from "../lib/collections/Invitations";
import {check} from "meteor/check";

/******************************************
 * si l'utilisateur est l'utilisateur courant, on lui renvoi tout
 **********************************/
Meteor.publish('UserPrivateInfo', function (id) {
    check(id, String);
    if (id === this.userId)
        return Meteor.users.find(id, {fields: {private: 1, public: 1, username: 1}});
});

Meteor.publish('ProjectForMembers', function (projectId, hashedSymKey) {
    check(projectId, String)
    check(hashedSymKey, String)

    const project = Project.findOne(projectId)
    if (project.private.hashedSymKey === hashedSymKey) {
        return Projects.find({_id: projectId},
            {
                // fields: {
                //     _id:1,
                //     name:1,
                //     public: 1,
                //     "private.createdAt": 1,
                //     "private.symEnc_asymPrivateKey":1,
                //
                //     "private.members.memberId": 1,
                //     "private.members.role": 1,
                //     "private.members.symEnc_username": 1,
                //     "private.members.symEnc_userId": 1,
                //     "private.members.symEnc_joinAtTs": 1,
                // }
            })
    }
})
Meteor.publish('invitation', function (authInfo, projectId) {
    check(authInfo, String)
    check(hashedPassword, String)
    const invitation = Invitation.findOne(invitationId)
    check( cryptoServer.compare(hashedPassword,invitation.hashedPassword),true)
    return Invitations.find({_id:invitationId})
})
Meteor.publish('invitationList', function (authInfo, projectId) {
    check(authInfo, {memberId: String, userSignature: String})
    check(projectId,String)
    let currentProject = Project.findOne(projectId)
    check(currentProject.isAdmin(authInfo), true)
    let invitationIds = []
    currentProject.private.invitations.forEach(invit=>{
        invitationIds.push(invit.invitationId)
    })
    return Invitations.find({"_id":{"$in": invitationIds}})
})

