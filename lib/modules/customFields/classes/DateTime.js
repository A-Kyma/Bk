import { DateTime as LuxonDateTime } from "luxon"

class DateTime extends Date {
  static getISODateString = function(value) {
    let d = DateTime.getISODate(value)
    return d.toISOString().split("T").shift()
  }

  static getISODateMax = function(value,options={offset: true}) {
    if (! value instanceof Date) return undefined
    let offset
    if (options.offset)
      offset = value.getTimezoneOffset();
    else
      offset = 0
    // use offset, add 23:59:59 to the date
    let d = new Date(value.getTime() - offset * 60 * 1000)
    d.setHours(23,59,59,999);
    return d
  }

  static getISODateMaxSunday = function(value,options) {
    let d = DateTime.getISODateMax(value,options)
    let n = 7 - d.getDay()
    if (n>6) n = 0
    return new Date(d.getTime() + 24*60*60*1000 * n)
  }

  static getISODateMin = function(value,options={offset: true}) {
    if (! value instanceof Date) return undefined
    let offset
    if (options.offset)
      offset = value.getTimezoneOffset();
    else
      offset = 0
    // use offset, add 23:59:59 to the date
    let d = new Date(value.getTime() - offset * 60 * 1000);
    d.setHours(0,0,0,0);
    return d
  }

  static getISODateMinMonday = function(value, options) {
    let d = DateTime.getISODateMin(value,options)
    let n = d.getDay() - 1
    if (n<0) n = 6
    return new Date(d.getTime() - 24*60*60*1000 * n)
  }

  static getISODate = function(value) {
    if (! value instanceof Date) return undefined
    let offset = value.getTimezoneOffset();
    let d = new Date(value.getTime() - offset * 60 * 1000);
    return d
  }

  static getDate = function(value) {
    return DateTime.getValue(value)
  }

  static getLongDate = function(value,locale) {
    return DateTime.getValue(value,{dateStyle: 'full'},locale)
  }

  static getTime = function(value) {
    return DateTime.getValue(value,{hour: "numeric", minute: "numeric", hour12: false})
  }

  static getDateTime = function(value,locale) {
    return DateTime.getValue(value, {dateStyle: 'short', timeStyle: 'short'},locale)
  }

  static getLongDateTime = function(value,locale) {
    return DateTime.getValue(value, {dateStyle: 'full', timeStyle: 'short'},locale)
  }

  static getLongMonthYearDate = function(value,locale) {
    let d = DateTime.getValue(value,{month: "long", year: "numeric"},locale)
    return d[0].toUpperCase() + d.slice(1)
  }

  static getLongRangeDate = function(start,end) {
    return DateTime.getLongDate(start) + " ~ " + DateTime.getLongDate(end)
  }

  static getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  /***
   * @description Create Luxon DateTime from Date and timeZone
   * @param {String|Date} date
   * @param {String} timeZone
   * @returns {LuxonDateTime} Luxon DateTime
   */
  static getDateTimeFromTimezone(date,timeZone="Europe/Brussels") {
    let datetime
    if (date instanceof Date)
      datetime = LuxonDateTime.fromJSDate(date, {zone: timeZone})
    else
      datetime = LuxonDateTime.fromISO(date, {zone: timeZone})
    return datetime
  }

  /***
   * @description Create a date from specific timeZone
   * @param {String|Date} date
   * @param {String} timeZone
   * @returns {Date} date at specific timeZone
   */
  static createDateFromTimezone(date,timeZone) {
    let datetime = this.getDateTimeFromTimezone(date,timeZone)
    return new Date(datetime.toString())
  }

  /***
   * @description Add days to a date, depending on timeZone (winter/summer hour is taken into account)
   * @param {String|Date} date
   * @param {String} timeZone
   * @param {Integer} daysToAdd
   * @returns {Date}
   */
  static addDaysToDateFromTimezone(date,timeZone,daysToAdd) {
    if (!!timeZone) {
      let datetime = this.getDateTimeFromTimezone(date, timeZone)
      date = new Date(datetime.plus({days: daysToAdd}).toString())
    } else {
      let datetime = (date instanceof Date) ? date : new Date(date)
      date.setDate(d.getDate() + daysToAdd)
    }
    return date
  }
}

export default DateTime;