jQuery(function($){
  chai.should();
  mocha
    .checkLeaks()
    .run();
});
