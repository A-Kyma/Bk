
class BkLib {
  static initClass() {
    this._type = "Bk";

    this.operators = {
      '+'(a, b) {
        return a + b;
      },
      '<'(a, b) {
        return a < b;
      },
      '>'(a, b) {
        return a > b;
      }
    };
  }

  static getSortMethod() {
    const _args = Array.prototype.slice.call(arguments);
    return function(a, b) {
      for (let x in _args) {
        let ax = a[_args[x].substring(1)];
        let bx = b[_args[x].substring(1)];
        let cx = undefined;
        ax = (typeof ax === "string" ? ax.toLowerCase() : ax / 1);
        bx = (typeof bx === "string" ? bx.toLowerCase() : bx / 1);
        if (_args[x].substring(0, 1) === "-") {
          cx = ax;
          ax = bx;
          bx = cx;
        }
        if (ax !== bx) { return (ax < bx ? -1 : 1); }
      }
    };
  }

  static humanize(size) {
    const gb = Math.pow(1024, 3);
    const mb = Math.pow(1024, 2);
    const kb = 1024;
    if (size >= gb) {
      return Math.floor(size / gb) + ' GB';
    } else if (size >= mb) {
      return Math.floor(size / mb) + ' MB';
    } else if (size >= kb) {
      return Math.floor(size / kb) + ' KB';
    } else {
      return size + ' Bytes';
    }
  }

  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static insertArray(array, index, item) {
    return array.splice(index, 0, item);
  }

  static getTime(date) {
    if (date === undefined) {
      date = new Date();
    } else {
      date = new Date(date);
    }
    return (date.getHours()-1) + " Hours " + date.getMinutes() + " Min " + date.getSeconds() + " Sec " + date.getMilliseconds() + " ms";
  }

  static getTimeDiffWithNow(dateStr, TimeStr) {
    //datetimeStr =  dateStr.substr(0,4)+'-'+ dateStr.substr(4,2)+'-'+dateStr.substr(6,2)+' '+ TimeStr.substr(0,2)+':'+TimeStr.substr(2,2)+':'+TimeStr.substr(4,2)
    let milisec_diff;
    const datetime = new Date(dateStr).getTime();
    const now = new Date().getTime();
    if (isNaN(datetime)) { return ""; }
    if (datetime < now) {
      milisec_diff = now - datetime;
    } else {
      milisec_diff = datetime - now;
    }
    const days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
    const date_diff = new Date(milisec_diff);
    if (days > 0) {
      return 0+dateStr.getDate()+'-'+ dateStr.getMonth()+'-'+dateStr.getFullYear();
    } else {
      if ((date_diff.getHours()-1) === 0) {
        return date_diff.getMinutes() + " Min " + date_diff.getSeconds() + " Sec";
      } else {
        return (date_diff.getHours()-1) + " Hours " + date_diff.getMinutes() + " Min " + date_diff.getSeconds() + " Sec";
      }
    }
  }
};
BkLib.initClass();

export default BkLib;

