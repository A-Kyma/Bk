import { Class } from 'meteor/akyma:astronomy'
import DateTime from "../modules/customFields/classes/DateTime";


const Device = Class.create({
    name: 'Device',
    fields: {
        id: { type: String},
        identifier: { type: String},
        device_os: { type: String},
        device_model: { type: String},
        session_count: {type: Number},
        timezone: {type: Number},
        created_at: { type: DateTime},
        updated_at: { type: DateTime},
        last_active: { type: DateTime},
        send_notification: {type: Boolean}
    },

})

export { Device };