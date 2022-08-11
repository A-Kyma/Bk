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
            return Device.sendNotification(data)
        }
    }
})

Device.sendNotification = function(data) {
    //no callback. error handled here
    const api = new Api()
    api.url = 'https://onesignal.com/api/v1/notifications'
    api.method = 'POST'
    api.authorization = Meteor.settings.oneSignal.authorisation

    api.callService(data)
      .then(result => {
          if (result.errors){
              // Check id that has become invalid
              let invalid_ids = result.errors.invalid_player_ids
              if (Array.isArray(invalid_ids) && invalid_ids.length > 0) {
                  invalid_ids.forEach(id => {
                      const user = Meteor.users.findOne({"profile.devices.id": id})
                      if (!user) return
                      let i = user.profile.devices.findIndex(device => device.id === id)
                      if (i === undefined) return
                      Meteor.users.update(user._id, {
                          ["profile.devices."+i+".send_notification"]: false
                      })
                  })
              } else
                  throw new Meteor.Error(500, JSON.stringify(result.errors))
          }
      })
}