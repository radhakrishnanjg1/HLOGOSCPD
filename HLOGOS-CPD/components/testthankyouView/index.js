
'use strict';

(function () {
    var view = app.testthankyouView = kendo.observable();
    var testthankyouViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("testthankyouView");
            } 
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            var firstquestion = JSON.parse(localStorage.getItem("question_details"));
             var imageurl = firstquestion[0].ThankYou_Image_URL;
             if (imageurl !== "") {
                 $("#spanthankyouimage").attr('src', "http:" + imageurl);
             }
             var firsttestsuccess = JSON.parse(localStorage.getItem("test_successdetails"));
             //$("#span_test_timetaken").html(firsttestsuccess[0].TimeTaken);
             //$("#span_test_score").html(firsttestsuccess[0].Score);
             //$("#span_test_result").html(firsttestsuccess[0].Result);
             $("#itestresult").removeClass();
             if (parseInt(firsttestsuccess[0].Score) >= 40)
             {
                 $("#itestresult").addClass("fa fa-check greencolor"); 
             }
             else {
                 $("#itestresult").addClass("fa fa-close redcolor"); 
             }
             var ethosmastervaluesdata = JSON.parse(localStorage.getItem("test_successdetails"));
             var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata) 
                 .ToJSON()); 
             var dataSource = new kendo.data.DataSource({
                 data: ethosmastervaluesrecords,
                 batch: true,
                 schema: {
                     model: { 
                         fields: { 
                             TimeTaken: { type: "string", editable: false },
                             Score: { type: "string", editable: false },
                             Result: { type: "string", editable: false },

                         }
                     }
                 }
             });
             $("#tblresultlist").kendoGrid({
                 dataSource: dataSource,
                 columns: [ 
                    { enabled: false, title: "TimeTaken(HH:MM:SS)", field: "TimeTaken", editable: false, },
                    {
                        enabled: false,width:100, title: "Score", field: "Score", editable: false,
                      },
                     {
                         enabled: false, width: 100, title: "Result", field: "Result", editable: false,
                      }, 
                
                 ],
                 editable: true
             });
        },
        redirectto_test_answer: function () {
            app.navigation.navigatestanswerView();
        }
    });

    view.set('testthankyouViewModel', testthankyouViewModel);
}());

  
