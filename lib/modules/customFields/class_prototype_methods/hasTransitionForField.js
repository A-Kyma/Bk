/***
 @description Retrieve transition if available
 @param String transition - transition's name to lookup
 @param String field - field on which Lifecycle is applied
 */
function hasTransitionForField(transition,field) {
  const transitions = this.getAvailableTransitions(field)
  return transitions.filter(t => t.name === "transition")
}

export default hasTransitionForField