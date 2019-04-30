import {check} from "meteor/check";
import Project from "../../../imports/classes/Project";
import Topic from "../../../imports/classes/Topic";
import Activity from "../../../imports/classes/Activity";
import NotifPush from "../../../imports/NotifPush";
import Comment from "../../../imports/classes/Comment";
import MapMarker from "../../../imports/classes/MapMarker";


Activity.extend({
    meteorMethods: {

        newCalendarActivity(authInfo, projectId, ActivityParmas, notifObjects) {
            check(ActivityParmas, {
                start:Date,
                end:Date,
                allDay:Boolean
            })
            check(authInfo, {memberId: String, userSignature: String})
            check(projectId, String)
            let currentProject = Project.findOne(projectId)
            check(currentProject.isMember(authInfo), true)
            let computedParams = {
                projectId: currentProject._id,
                createdBy: authInfo.memberId,
                participants : [authInfo.memberId]
            }
            ActivityParmas = {...ActivityParmas, ...computedParams}
            let newActivity = new Activity(ActivityParmas)

            return newActivity.save((err) => {
                if (!err) {
                    // check(notifObjects, [{
                    //     userId: String,
                    //     memberId: String,
                    //     hashControl: String
                    // }])
                    //
                    // topic.save()
                    // topic.notifySubscribers(notifObjects, authInfo.memberId)
                    console.warn('todo : ENvoyer les notifs')
                } else {
                    console.log(err)
                }
            })
        },
        editCalendarActivityTime(authInfo,params){
            check(authInfo, {memberId: String, userSignature: String})
            check(params, {
                start:Date,
                end:Date,
                allDay:Boolean
            })
            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.start = params.start
            activity.end= params.end
            activity.allDay = params.allDay
            return activity.save()
        },
        changeColor(authInfo, color) {
            check(authInfo, {memberId: String, userSignature: String})
            check(color, Number)
            let activity = Activity.findOne(this._id)

            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.color = color
            activity.lastEditAt = new Date()
            return activity.save()
        },
        editActivityTexts(authInfo, params) {
            check(authInfo, {memberId: String, userSignature: String})
            check(params, {
                symEnc_title: String,
                symEnc_detail: String
            })
            let activity = Activity.findOne(this._id)

            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            activity.symEnc_title = params.symEnc_title
            activity.symEnc_detail = params.symEnc_detail
            activity.lastEditAt = new Date()
            return activity.save()
        },
        delete(authInfo) {
            check(authInfo, {memberId: String, userSignature: String})

            let activity = Activity.findOne(this._id)
            let currentProject = Project.findOne(activity.projectId)
            check(currentProject.isMember(authInfo), true)
            return activity.remove((err) => {
            })
        }
    }
})
