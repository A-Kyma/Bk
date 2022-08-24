import { Class } from 'meteor/jagi:astronomy'
import { fetch, Headers } from 'meteor/fetch';

const Api = Class.create({
    name: 'Api',
    fields: {
        url: { type: String},
        method: { type: String},
        authorization: { type: String},
        contentType: { type: String},
    },
    helpers: {
        //https://javascript.info/async
        //added async to return a promise instead of a callback
        async callService (data) {
            if (data === undefined && this.method === 'POST'){
                return undefined
            }

            if (this.contentType === undefined){
                this.contentType = 'application/json; charset=utf-8'
            }

            let headers = {
                Authorization: this.authorization,
                'Content-Type': this.contentType
            }

            let reqParam = {}
            reqParam.method = this.method
            reqParam.headers = new Headers(headers)

            if (this.method === 'POST'){
                reqParam.body = JSON.stringify(data)
            }

            let response
            try {
                response = await fetch(this.url, reqParam);
                let result = await response.json();
                // return could still give a http error
                return result
            } catch (err) {
                //technical issue
                throw new Meteor.Error(500, JSON.stringify({err,response}))
             }
        }
    }
})

export { Api };