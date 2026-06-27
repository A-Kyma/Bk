import {Device} from "../../lib/classes/device";
import {Api} from "./api";

function disableNotificationsForPlayerIds(playerIds) {
    if (!Array.isArray(playerIds) || playerIds.length === 0) return

    playerIds.forEach((id) => {
        const user = Meteor.users.findOne({"profile.devices.id": id})
        if (!user) return

        const i = user.profile.devices.findIndex(device => device.id === id)
        if (i < 0 || user._id === undefined) return

        Meteor.users.update(user._id, {
            $set: {
                ["profile.devices." + i + ".send_notification"]: false
            }
        })
    })
}

function hasUnsubscribedPlayersError(errors) {
    const messages = Array.isArray(errors)
        ? errors
        : (typeof errors === 'object' && errors !== null ? Object.values(errors).flat() : [errors])

    return messages.some((entry) => String(entry || '').toLowerCase().includes('not subscribed'))
}

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

Device.sendNotification = function(data, authorization) {
    //no callback. error handled here
    const api = new Api()
    api.url = 'https://onesignal.com/api/v1/notifications'
    api.method = 'POST'
    api.authorization = authorization || Meteor.settings?.oneSignal?.authorisation

    api.callService(data)
      .then(result => {
          if (!result?.errors) return

          const invalid_ids = result.errors.invalid_player_ids
          if (Array.isArray(invalid_ids) && invalid_ids.length > 0) {
              disableNotificationsForPlayerIds(invalid_ids)
              return
          }

          if (hasUnsubscribedPlayersError(result.errors)) {
              const playerIds = Array.isArray(data?.include_player_ids) ? data.include_player_ids : []
              disableNotificationsForPlayerIds(playerIds)
              console.warn('[Device.sendNotification] unsubscribed OneSignal players:', playerIds, result.errors)
              return
          }

          console.warn('[Device.sendNotification] OneSignal error:', result.errors)
      })
      .catch(error => {
          console.warn('[Device.sendNotification] failed:', error?.message || error)
      })
}
