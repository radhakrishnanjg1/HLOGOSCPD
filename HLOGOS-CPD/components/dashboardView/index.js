
'use strict';

(function () {
    var view = app.dashboardView = kendo.observable();
    var dashboardViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("dashboardView");
            }
            app.navigation.logincheck();
            //if (localStorage.getItem("test_details_live") == null ||
            //   localStorage.getItem("test_details_live") != 1) {
                app.utils.loading(true);
                fun_db_APP_HLOGOS_GetLessonsForTest_Employees($('#hdnEmployee_ID').val());
            //}
        },
        onRefresh: function () {
            
        }, 
    });

    view.set('dashboardViewModel', dashboardViewModel);
}());

function fun_db_APP_HLOGOS_GetLessonsForTest_Employees(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_HLOGOS_GetLessonsForTest_Employees",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        },
        error: function (e) {
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later.!');
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        $("#dvdashboardview").show();
        var allrecords = JSON.parse(JSON.stringify(data));
        localStorage.setItem("test_details", JSON.stringify(data));
        localStorage.setItem("test_details_live", 1);
        var records = JSON.parse(Enumerable.From(allrecords)
         .ToJSON());
        var recordsdatasource = new kendo.data.DataSource({
            data: records,
        });
        $("#listview-lessonlist").kendoMobileListView({
            dataSource: recordsdatasource,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-lessonlist").append("<li>No active test available!</li>");
                }
            },
            template: $("#template-lessonlist").html(),
        });
        $("#listview-lessonlist li div").removeClass(".km-widget km-button");
    }); 
}

function fun_goto_test(e) {
    var data = e.button.data();
    var lesson_id = parseInt(data.lesson_id);
    app.utils.loading(true);
    fun_db_APP_HLOGOS_GetDetailsForTest(lesson_id); 
}

function fun_db_APP_HLOGOS_GetDetailsForTest(Lesson_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_HLOGOS_GetDetailsForTest",
                type: "POST",
                dataType: "json",
                data: {
                    "Lesson_ID": Lesson_ID
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        },
        error: function (e) {
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later.!');
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        localStorage.removeItem("user_answer_details");
        app_db_init();
        app.utils.loading(false);
        localStorage.setItem("question_details", JSON.stringify(data)); 
        var objdistinctquestions = Enumerable
           .From(data)
           .Select("$.Question_ID")
           .Distinct().ToArray();
        localStorage.setItem("distinct_questions", JSON.stringify(objdistinctquestions)); 
        var allrecords = JSON.parse(localStorage.getItem("test_details"));
        var single_record = JSON.parse(Enumerable.From(allrecords)
             .Where("$.Lesson_ID=='" + Lesson_ID + "'")
        .ToJSON());
        localStorage.setItem("test_single", JSON.stringify(single_record));
        app.navigation.navigatetestwelcomeView();
        //app.navigation.navigatetest();
    });
}
