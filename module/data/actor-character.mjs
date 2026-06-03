import UltraQuestActorBase from "./base-actor.mjs";

export default class UltraQuestCharacter extends UltraQuestActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
      flat: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0 })
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.ULTRAQUEST.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      });
      return obj;
    }, {}));

    schema.scores = new fields.SchemaField(Object.keys(CONFIG.ULTRAQUEST.scores).reduce((obj, score) => {
      obj[score] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      });
      return obj;
    }, {}));

    schema.skills = new fields.SchemaField(Object.keys(CONFIG.ULTRAQUEST.skills).reduce((obj, skill) => {
      obj[skill] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      });
      return obj;
    }, {}));

    return schema;
  }
  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value) / 10);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.ULTRAQUEST.abilities[key]) ?? key;
    }

    for (const key in this.scores) {
      // Calculate the modifier using d20 rules.
      this.scores[key].mod = Math.floor((this.scores[key].value) / 5);
      // Handle ability label localization.
      this.scores[key].label = game.i18n.localize(CONFIG.ULTRAQUEST.scores[key]) ?? key;
    }

    for (const key in this.skills) {
      // Calculate the modifier using d20 rules.
      this.skills[key].mod = Math.floor((this.skills[key].value) / 5);
      // Handle ability label localization.
      this.skills[key].label = game.i18n.localize(CONFIG.ULTRAQUEST.skills[key]) ?? key;
    }

  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k,v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    if (this.scores) {
      for (let [k,v] of Object.entries(this.scores)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    if (this.skills) {
      for (let [k,v] of Object.entries(this.skills)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    data.lvl = this.attributes.level.value;
    data.flat = this.attributes.flat.value;

    return data
  }
}