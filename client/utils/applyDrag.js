const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) return false
  if (removedIndex === addedIndex) return false

  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = arr.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    arr.splice(addedIndex, 0, itemToAdd)
  }

  return true
}

export default applyDrag;