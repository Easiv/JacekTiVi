import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
  name: attr(),
  isAuthenticated: attr(),
  isVip: attr(),
  isAdmin: attr()
});