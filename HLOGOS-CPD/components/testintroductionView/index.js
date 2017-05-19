
'use strict';

(function () {
    var view = app.testintroductionView = kendo.observable();
    var testintroductionViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("testintroductionView");
            } 
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            var firstquestion = JSON.parse(localStorage.getItem("question_details"));
            //Welcome_Image_URL	Introduction_Image_URL	ThankYou_Image_URL
            var imageurl = firstquestion[0].Introduction_Image_URL;
            if (imageurl !== "") {
                $("#spanintroductionimage").attr('src', "http:" + imageurl);
            }
        },
        redirectto_test: function () {
            var allrecords = JSON.parse(localStorage.getItem("test_single"));
            var single_record = JSON.parse(Enumerable.From(allrecords) 
            .ToJSON());
            if (single_record[0].Test_Type_Master_ID == 704) {
                app.navigation.navigatetestcontentView();
            }
            else {
                app.navigation.navigatetest();
            }
        }
    });

    view.set('testintroductionViewModel', testintroductionViewModel);
}());

  
