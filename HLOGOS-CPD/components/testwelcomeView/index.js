
'use strict';

(function () {
    var view = app.testwelcomeView = kendo.observable();
    var testwelcomeViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("testwelcomeView");
            } 
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            var firstquestion = JSON.parse(localStorage.getItem("question_details"));
            //Welcome_Image_URL	Introduction_Image_URL	ThankYou_Image_URL
            var imageurl = firstquestion[0].Welcome_Image_URL;
            if (imageurl !== "")
            { 
                $("#spanwelcomeimage").attr('src', "http:" + imageurl);
            }
        },
        redirectto_introduction_test: function () {
            app.navigation.navigatetestintroductionView();
        }
    });

    view.set('testwelcomeViewModel', testwelcomeViewModel);
}());

  
