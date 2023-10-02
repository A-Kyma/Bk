class Percentage extends Number {

}

Percentage.getValue = function(value) {
  return Math.round(value*100)
}

export default Percentage