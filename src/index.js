import $ from 'jquery';
import 'bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

$(document).ready(function() {
        // init controller
        var controller = new ScrollMagic.Controller();
        // create a scene
        var scene1 = new ScrollMagic.Scene({
          triggerElement: '#scene1',
          duration: 500,
          offset: 300
        })
          .setClassToggle('#scene1', 'changeBackground')
          .addTo(controller)
});