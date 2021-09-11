import traverse from "../../core/utils/traverse";

function getStaticBelongsToRelations() {
  let model = new this()
  return model.getBelongsToRelation()
}

export default getStaticBelongsToRelations;