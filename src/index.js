import $ from 'jquery';
import '../public/style.css';
import 'bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { fly, fly2, fly3, fly1 } from './scrollmagic';

$(document).ready(function() {
        // init controller
        var controller = new ScrollMagic.Controller();
        // create a scene
        var scene1 = new ScrollMagic.Scene({
          triggerElement: '#scene1',
          duration: 500,
          offset: 5000
        })
        .on('start', function (){
            fly()
            fly1()
            fly2()    
            fly3()
        })
          .setClassToggle('#scene1', 'changeBackground')
          .addTo(controller)
});

$(function () { // wait for document ready
    // init
    var controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave',
            duration: "100%" // this works just fine with duration 0 as well
            // However with large numbers (>20) of pinned sections display errors can occur so every section should be unpinned once it's covered by the next section.
            // Normally 100% would work for this, but here 200% is used, as Panel 3 is shown for more than 100% of scrollheight due to the pause.
        }
    });

    // get all slides
    var slides = document.querySelectorAll("div.panel");

    // create scene for every slide
    for (var i=0; i<slides.length; i++) {
        new ScrollMagic.Scene({
                triggerElement: slides[i]
            })
            .setPin(slides[i], {pushFollowers: false})
            .addTo(controller);
    }
});
