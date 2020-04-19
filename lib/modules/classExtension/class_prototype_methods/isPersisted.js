import traverse from "../../core/utils/traverse";

function isPersisted() {
  return !this.constructor.isNew(this);
}

export default isPersisted;