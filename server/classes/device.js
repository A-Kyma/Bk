import {Device} from "../../lib/classes/device";
import {Api} from "./api";

Device.extend({
    helpers: {
        getOneSignalUserDeviceDetails(callback) {
            //callback needed to handle result in setDevice method
            const api = new Api()
            api.url = 'https://onesignal.com/api/v1/players/'+ this.id + '?app_id=' + Meteor.settings.oneSignal.appId
            api.method = 'GET'
            api.authorization = Meteor.settings.oneSignal.authorisation

            api.callService()
                .then(result => {
                    callback(result)
                });
        },
        sendNotification(data){
            //no callback. error handled here
            const api = new Api()
            api.url = 'https://onesignal.com/api/v1/notifications'
            api.method = 'POST'
            api.authorization = Meteor.settings.oneSignal.authorisation

            api.callService(data)
                .then(result => {
                    if (result.errors){
                        throw new Meteor.Error(500, JSON.stringify(result.errors))
                    }
                });
        }
    }
})