import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('questions', function() {
    this.route('new');
  });
  this.route('question', { path: 'question/:question_id'});
  this.route('play', function() {});
  this.route('users');
  this.route('kwiplasz');
  this.route('room', { path: 'kwiplasz/:room_id'});
});

export default Router;
