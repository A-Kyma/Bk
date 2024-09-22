import * as XLSX from 'xlsx/xlsx.mjs'
import {I18n} from "meteor/akyma:bk"

export default function XlsExportTreatment(rows,params) {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const headers = Object.keys(rows[0])

  // Change header: https://docs.sheetjs.com/docs/getting-started/examples/export#clean-up-workbook
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [headers.map(title => I18n.t(title.replaceAll("|","."),{locale:params.locale}).capitalize())],
    {origin: "A1"}
  )

  // Change cell type: https://docs.sheetjs.com/docs/csf/cell#cell-types if needed


  // Adapt column width: https://docs.sheetjs.com/docs/csf/features/colprops#column-widths
  worksheet["!cols"] = headers.map(column => {
    const max_width = rows.reduce(
      (w, r) => Math.max(w, r[column]?.length || 0),
      I18n.t(column.replaceAll("|","."),{locale:params.locale}).length
    )
    return { wch: max_width }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Export")

  return workbook
}