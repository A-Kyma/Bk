import Enum from "../customs/Enum"


const BkChartView = Enum.create({
  name: "BkChartView",
  identifiers: ["line","bar","pie","doughnut","polar","radar"]
})

BkChartView.getLabelKey = function(field) { return field[0].toUpperCase() + field.slice(1) }

export default BkChartView