import UltraQuestItemBase from "./base-item.mjs";

export default class UltraQuestSpell extends UltraQuestItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.spellLevel = new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0, max: 9 });

    return schema;
  }
}