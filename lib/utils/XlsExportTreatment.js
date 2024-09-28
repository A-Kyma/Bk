import {utils} from 'xlsx/xlsx.mjs'
import {Class} from "meteor/jagi:astronomy"
import {I18n,Enum,Lifecycle} from "meteor/akyma:bk"
import XlsExportColumnTypes from "../classes/XlsExportColumnTypes";

export default function XlsExportTreatment(result,{locale,...params}) {
  //const worksheet = utils.json_to_sheet(rows)

  const headers = result.headers.map(elem => I18n.t(elem.label,{locale}).capitalize())
  const sheetData = [headers].concat(result.data)
  // Create for array of array
  // See https://docs.sheetjs.com/docs/api/utilities/array#data-storage
  const worksheet = utils.aoa_to_sheet(
    sheetData,
    {cellDates: true, dense: true},
  )

  // const headers = Object.keys(rows[0])
  //
  // // Change header: https://docs.sheetjs.com/docs/getting-started/examples/export#clean-up-workbook
  // utils.sheet_add_aoa(
  //   worksheet,
  //   [headers.map(title => I18n.t(title.replaceAll("|","."),{locale}).capitalize())],
  //   {origin: "A1"}
  // )

  // Change cell type: https://docs.sheetjs.com/docs/csf/cell#cell-types if needed
  //worksheet["E2"].z="# ##0,00_)€;[Red]-# ##0,00_)€" // dense = false
  //worksheet[4][1].z="# ##0,00_)€;[Red]-# ##0,00_)€" // dense = true
  const numberOfRows = sheetData.length
  result.headers.forEach((elem,j) => {
    let format = XlsExportColumnTypes.getFormat(elem.columnType)
    if (!!format) {
      let applyFormat
      if (["Enum","Lifecycle"].includes(elem.columnType)) {
        let ColumnClass
        let columnClassName = elem[elem.columnType.toLowerCase() + "Type"]
        if (elem.columnType === "Enum")
          ColumnClass = Enum.enums[columnClassName]
        if (elem.columnType === "Lifecycle"){
          ColumnClass = Lifecycle.lifecycles[columnClassName]
        }
        if (!ColumnClass && typeof ColumnClass.getLabelKey !== "function")
          return

        applyFormat = function(cell) {
          if (cell)
            cell.v = I18n.get(ColumnClass.getLabelKey(cell.v))
        }
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

  // worksheet["!cols"] = headers.map(column => {
  //   const max_width = rows.reduce(
  //     (w, r) => Math.max(w, r[column]?.length || 0),
  //     I18n.t(column,{locale}).length
  //   )
  //   return { wch: max_width }
  // })

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, "Export")

  return workbook
}