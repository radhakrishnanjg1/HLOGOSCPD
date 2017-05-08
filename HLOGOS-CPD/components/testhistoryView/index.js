
'use strict';

(function () {
    var view = app.testhistoryView = kendo.observable();
    var testhistoryViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("dashboardView");
            }
            app.navigation.logincheck();
                app.utils.loading(true);
                fun_db_APP_HLOGOS_Get_Employees_Lessons_History($('#hdnEmployee_ID').val());
            
        },
        onRefresh: function () {
            
        }, 
    });

    view.set('testhistoryViewModel', testhistoryViewModel);
}());

function fun_db_APP_HLOGOS_Get_Employees_Lessons_History(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_HLOGOS_Get_Employees_Lessons_History",
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
        localStorage.setItem("test_history_details_live", 1);
        $("#dvtesthistoryView").show();
        var allrecords = JSON.parse(JSON.stringify(data)); 
        var records = JSON.parse(Enumerable.From(allrecords)
         .ToJSON());
        var recordsdatasource = new kendo.data.DataSource({
            data: records,
        });
        $("#listview-lessonhistory").kendoMobileListView({
            dataSource: recordsdatasource,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-lessonhistory").append("<li>Not yet taken any test!</li>");
                }
            },
            template: $("#template-lessonhistory").html(),
        }); 
    }); 
}
 
