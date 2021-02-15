const replace = (string, regex, replacements) => {
  // validation regexs
  const successiveLeftParenthesisRegex = /\([^)]*\(/g
  const successiveRightParenthesisRegex = /\)[^(]*\)/g
  const captureGroupsRegex = /\([^\)]*\)/g
  const namedCaptureGroupsRegex = /\(\?<[^\(\)]*>[^\(\)]*\)/g
  const captureGroupsNamesRegex = /(\(\?\<(?<name>[^\(\)]*)\>[^\(\)]*\))/g

  // validation matches
  const captureGroupsMatches = regex.toString().match(captureGroupsRegex)
  const namedCaptureGoupsMatches = regex.toString().match(namedCaptureGroupsRegex)
  const captureGoupsNamesMatches = [...regex.toString().matchAll(captureGroupsNamesRegex)].reduce((groupNamesMap, match) => { 
    groupNamesMap[match[2]] = 1
    return groupNamesMap
  }, {})

  // validation rules
  if(successiveLeftParenthesisRegex.test(regex.toString()) || successiveRightParenthesisRegex.test(regex.toString())) {
    throw ('the regex must not have nested capture groups')
  } 
  if(captureGroupsMatches && namedCaptureGoupsMatches && captureGroupsMatches.length !== namedCaptureGoupsMatches.length) {
    throw ('the regex must contain only capture groups of the same kind (either named or unnamed)')
  }
  if(namedCaptureGoupsMatches === null && !Array.isArray(replacements)) {
    throw('replacements param must be an array of replacement values of the same size than the group count in the input regex')
  }
  if(Array.isArray(replacements) && (!captureGroupsMatches || captureGroupsMatches.length !== replacements.length)) {
    throw ('replacements size and capture groups count must be the same in input regex')
  } 
  if(namedCaptureGoupsMatches && namedCaptureGoupsMatches.length > 0) {
    if(typeof replacements !== 'object' || Array.isArray(replacements)) {
      throw('replacements param must be a map having keys matching exactly the names of the input regex capture groups')
    }
    if(Object.keys(captureGoupsNamesMatches).join() !== Object.keys(replacements).join()) {
      throw('replacements param must be a map having keys matching exactly the names of the input regex capture groups')
    }
  }

  // replacement
  if(!Array.isArray(replacements)) {
    // map of replacements by named captures
    return string.replace(regex, (...args) => {
      const matches = args.slice(-1)
      return matches.length === 0 ? args[0] : Object.keys(matches[0]).reduce((reduced, current) => reduced.replace(matches[0][current], replacements[current]), args[0])
    })
  } else {
    // array of replacements by indexed captures
    return string.replace(regex, (...args) => {
      const matches = args.slice(1, 1 + replacements.length)
      return matches.reduce((reduced, current, i) => reduced.replace(current, replacements[i]), args[0])
    })
  }
}

module.exports = replace