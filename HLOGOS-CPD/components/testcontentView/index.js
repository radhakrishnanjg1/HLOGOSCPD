
'use strict';

(function () {
    var view = app.testcontentView = kendo.observable();
    var testcontentViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("testcontentView");
            } 
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            var firstquestion = JSON.parse(localStorage.getItem("question_details"));
            var imageurl = firstquestion[0].Content_URL;
             $("#iftestcontent").attr('src', "http:" + imageurl);
        },
        redirectto_test: function () {
            app.navigation.navigatetest();
        }
    });

    view.set('testcontentViewModel', testcontentViewModel);
}());

  
