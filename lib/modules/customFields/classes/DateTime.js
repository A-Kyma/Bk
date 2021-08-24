class DateTime extends Date {
  static getISODateString = function(value) {
    let d = DateTime.getISODate(value)
    return d.toISOString().split("T").shift()
  }

  static getISODateMax = function(value) {
    if (! value instanceof Date) return undefined
    let offset = value.getTimezoneOffset();
    // use offset, add 23:59:59 to the date
    let d = new Date(value.getTime() - offset * 60 * 1000 + 24*60*60*1000 - 1);
    return d
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

  static getLongDate = function(value) {
    return DateTime.getValue(value,{weekday: "long", day: "numeric", month: "long", year: "numeric"})
  }

  static getTime = function(value) {
    return DateTime.getValue(value,{hour: "numeric", minute: "numeric"})
  }

  static getLongDateTime = function(value) {
    return DateTime.getValue(value, {weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"})
  }
}

export default DateTime;