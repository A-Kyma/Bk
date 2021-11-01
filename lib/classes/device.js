import { Class } from 'meteor/jagi:astronomy'



const Device = Class.create({
    name: 'Device',
    fields: {
        id: { type: String},
        identifier: { type: String},
        device_os: { type: String},
        device_model: { type: String},
        session_count: {type: Number},
        timezone: {type: Number},
        created_at: { type: Date},
        updated_at: { type: Date},
        last_active: { type: Date},
        send_notification: {type: Boolean}
    },

})

export { Device };