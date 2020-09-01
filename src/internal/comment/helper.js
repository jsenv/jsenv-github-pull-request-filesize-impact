// https://gist.github.com/borekb/f83e48479aceaafa43108e021600f7e3
export const anchor = (text, id) => {
  return `<a href="#user-content-${id.replace()}">${text}<a>`
}

export const isAdded = ({ base }) => !base

export const isDeleted = ({ base, afterMerge }) => base && !afterMerge

export const isModified = ({ base, afterMerge }) =>
  base && afterMerge && base.hash !== afterMerge.hash

export const sumSize = (from, into, sizeName) => {
  if (sizeName in into) {
    const currentSize = into[sizeName]
    // This if exists because transform may fail sizeValue can be "error"
    // This case is handled like this: if a size is "error", the sum of all size is "error"
    // (Because sum of all size cannot be computed)
    if (typeof currentSize === "number") {
      return currentSize + from[sizeName]
    }
    return currentSize
  }
  return from[sizeName]
}

export const groupComparisonToFileByFileImpact = (groupComparison) => {
  const fileByFileImpact = {}
  Object.keys(groupComparison).forEach((fileRelativeUrl) => {
    const { base, afterMerge } = groupComparison[fileRelativeUrl]

    if (isAdded({ base, afterMerge })) {
      fileByFileImpact[fileRelativeUrl] = {
        base,
        afterMerge,
        event: "added",
      }
      return
    }

    if (isDeleted({ base, afterMerge })) {
      fileByFileImpact[fileRelativeUrl] = {
        base,
        afterMerge,
        event: "deleted",
      }
      return
    }

    if (isModified({ base, afterMerge })) {
      fileByFileImpact[fileRelativeUrl] = {
        base,
        afterMerge,
        event: "modified",
      }
    }
  })
  return fileByFileImpact
}

export const renderEachGroup = (renderGroup, { snapshotComparison, trackingConfig }) => {
  const groupMessages = Object.keys(snapshotComparison).map((groupName) => {
    const groupComparison = snapshotComparison[groupName]
    const emptyGroup = Object.keys(groupComparison).length === 0
    if (emptyGroup) {
      return renderEmptyGroup(groupName, trackingConfig[groupName])
    }
    return renderGroup(groupComparison, groupName)
  })

  return groupMessages.join(`

`)
}

const renderEmptyGroup = (groupName, groupConfig) => {
  return `<h5>${groupName} (0)</h5>
  <p>No file in ${groupName} group (see config below).</p>

\`\`\`json
${JSON.stringify(groupConfig, null, "  ")}
\`\`\`

</details>`
}
