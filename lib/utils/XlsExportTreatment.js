import {utils} from 'xlsx/xlsx.mjs'
import {Class} from "meteor/jagi:astronomy"
import {I18n,Enum,Lifecycle} from "meteor/akyma:bk"
import XlsExportColumnTypes from "../classes/XlsExportColumnTypes";

export default function XlsExportTreatment(result,{locale,...params}) {
  const headers = result.headers.map(elem => I18n.t(elem.label,{locale}).capitalize())
  const sheetData = [headers].concat(result.data)
  const numberOfRows = sheetData.length

  // Format Enum, Lifecycle and Array of values
  result.headers.forEach((elem,j) => {
    let applyFormat
    if (["Enum","Lifecycle","Class"].includes(elem.columnType)) {
      let ColumnClass
      let columnClassName = elem[elem.columnType.toLowerCase() + "Type"]
      if (elem.columnType === "Enum")
        ColumnClass = Enum.get(columnClassName)
      if (elem.columnType === "Lifecycle"){
        ColumnClass = Lifecycle.get(columnClassName)
      }
      if (elem.columnType === "Class") {
        ColumnClass = Class.get(columnClassName)
      }
      if (!ColumnClass && typeof ColumnClass.getLabelKey !== "function")
        return

      if (elem.columnType === "Class") {
        applyFormat = function (cell) {
          if (cell) {
            const classInstance = new ColumnClass(cell)
            if (elem.classField)
              return classInstance.get(elem.classField)
            else
              return typeof classInstance.defaultName === "function" ? classInstance.defaultName() : classInstance._id
          }
        }
      } else {
        applyFormat = function (cell) {
          if (cell)
            return I18n.get(ColumnClass.getLabelKey(cell))
        }
      }
    } else {
      applyFormat = function(cell) {
        return cell
      }
    }

    // From line 1 since not formatting header
    for (let i = 1; i < numberOfRows; i++) {
      let cell = sheetData[i][j]
      if (Array.isArray(cell)) {
        cell = cell.map(el => applyFormat(el)).join(", ")
      } else {
        cell = applyFormat(sheetData[i][j])
      }
      sheetData[i][j] = cell
    }
  })

  // Create for array of array
  // See https://docs.sheetjs.com/docs/api/utilities/array#data-storage
  const worksheet = utils.aoa_to_sheet(
    sheetData,
    {cellDates: true, dense: true},
  )

  // Change cell type: https://docs.sheetjs.com/docs/csf/cell#cell-types if needed
  //worksheet["E2"].z="# ##0,00_)€;[Red]-# ##0,00_)€" // dense = false
  //worksheet[4][1].z="# ##0,00_)€;[Red]-# ##0,00_)€" // dense = true
  result.headers.forEach((elem,j) => {
    let format = XlsExportColumnTypes.getFormat(elem.columnType)
    if (!!format) {
      let applyFormat
      if (["Enum","Lifecycle"].includes(elem.columnType)) {
        return
      } else {
        applyFormat = function(cell){
          if (cell)
            cell.z = format
        }
      }
      // From line 1 since not formatting header
      for (let i = 1; i < numberOfRows; i++) {
        applyFormat(worksheet[i][j])
      }
    }
  })

  // Adapt column width: https://docs.sheetjs.com/docs/csf/features/colprops#column-widths
  const columnLengths = sheetData.reduce(
    (accumulator,currentRow) => {
      return accumulator.map(
        (item, index) => Math.max(item,currentRow[index]?.toString().length || 0)
      )
    },
    Array.from(sheetData[0], (x) => 0) // Array of 0
  )
  result.headers.forEach((elem,j) => {
    switch(elem.columnType) {
      case "datetime":
        columnLengths[j] = 16
        break
      case "date":
        columnLengths[j] = 10
        break
      case "amount":
        columnLengths[j]+=4
      default:
        columnLengths[j]+=2
    }
  })
  worksheet["!cols"] = columnLengths.map(size => { return {wch: size}})

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Export")

  return workbook
}