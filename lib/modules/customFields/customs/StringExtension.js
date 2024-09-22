/***
 @description pad before if size < 0 and pad after with spaces if size > 0
 @param {Integer} size Final length of the String if not greater than |size|
*/
String.prototype.pad = function (size) {
  if (size < 0) {
    if (this.length >= -size) return String(this)
    return String(" ".repeat(-size) + this).slice(size);
  } else {
    if (this.length >= size) return String(this)
    return String(this + " ".repeat(size)).slice(0,size);
  }
};

String.prototype.truncate = function(size) {
  return this.slice(0,Math.abs(size)).pad(size)
}

String.prototype.capitalize = function() {
  return this[0].toUpperCase() + this.slice(1)
}