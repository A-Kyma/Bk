function getHighestParent() {
  let parent = this;
  while (parent.getParent()) {
    parent = parent.getParent();
  };
  return parent;
}

export default getHighestParent;