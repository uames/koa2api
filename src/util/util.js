// 修改列表中的数据项
export function updateList (list, replaceItem) {
  return list.map((item) => {
    if (item.id === replaceItem.id) {
      return replaceItem
    }
    return item
  })
}

export function addToList (list, newItem) {
  list.push(newItem)
  return list
}

export function responseHandle (body, cb) {
  if (body.errCode) {
    alert(body.msg)
    return
  }
  cb()
}

export function removeFromList (list, ids) {
  return list.filter((item) => {
    return !(item.id in ids)
  })
}
