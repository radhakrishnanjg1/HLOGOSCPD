'use strict';

(function () {

    var view = app.authenticationView = kendo.observable({
        onShow: function (e) { 
            var actionvalue = e.view.params.action;
            if (actionvalue == "logout") {                
                app.utils.loading(true);
                var user = JSON.parse(localStorage.getItem("userdata"));
                fun_db_APP_User_Logout(user.Login_ID, user.Employee_ID, app.utils.deviceinformation('Logout'));
                $('#username').val('');
                $('#password').val('');
                $('#hdnLogin_ID').val('0'); 
                localStorage.clear(); 
            }
            if (app.user != null) {
                return app.navigation.navigatedashboard();
            }
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("authenticationView");
            }
        }, 
    });

    var provider = app.data.defaultProvider;
    var mode = app.constants.authenticationModeSignin;
    var registerRedirect = 'activitiesView';
    var signinRedirect = 'activitiesView';



    var vm = kendo.observable({
        user: {
            displayName: '',
            //username: '',
            //password: '',
            //username: '5969',
            //password: '5969',
             
        },
        loginValidator: null,
        registerValidator: null,

        signin: function (username, password) { 
            var model = vm.user;
            if (model.username == '') {
                username = model.username;
                app.notify.error("Enter username!");
                return false;
            }

            if (model.password == '') {
                password = model.password;
                app.notify.error("Enter password!");
                return false;
            } 
            app.utils.loading(true);
            fun_db_APP_Verify_Field_User_Authentication(model.username, model.password, app.utils.deviceinformation('Login'));
        },
        forgotpasswordopen: function () {
            $("#modalview-forgotpassword").kendoMobileModalView("open");
            $("#aclosemodalforgotpassword").removeClass("km-button");
            },
        forgotpassword: function (username) {
            var model = vm.user;
            if (model.username == '') {
                username = model.username;
                app.notify.error("Enter username!");
                return false;
            } 
            app.utils.loading(true);
            fun_db_APP_Verify_Field_User_ForgotPassword(model.username, app.utils.deviceinformation('ForgotPassword'));
        },
    });

    view.set('authenticationViewModel', vm);
}());

function closemodalforgotpassword() {
    $("#modalview-forgotpassword").kendoMobileModalView("close");
}

function fun_db_APP_Verify_Field_User_Authentication(username, password, deviceinfo) {
    var storelogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_Verify_Field_User_Authentication",
                type: "POST",
                dataType: "json",
                data: {
                    "Username": username, "Password": password, "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getlogin = response.Result.Data;
                return getlogin;
            }
        }
    });

    storelogin.fetch(function () {
        var data = this.data();
        if (data[0][0].Output_ID == 1) { 
            $('#dvusername').html(data[0][0].Employee_Name)
            $('#hdnLogin_ID').val(data[0][0].Login_ID)
            $('#hdnEmployee_ID').val(data[0][0].Employee_ID)
            localStorage.clear();
            localStorage.setItem("userdata", JSON.stringify(data[0][0])); // userdata details 
            app.navigation.navigatedashboard(); 
        }
        else {
            app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_User_Logout(Login_ID, Employee_ID, deviceinfo) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_User_Logout",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID, "Employee_ID": Employee_ID, "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            app.utils.loading(false);
        }
        else {
            app.notify.error(data[0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_Verify_Field_User_ForgotPassword(username, deviceinfo) {
    var storelogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_Verify_Field_User_ForgotPassword",
                type: "POST",
                dataType: "json",
                data: {
                    "Username": username,
                    "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getlogin = response.Result.Data;
                return getlogin;
            }
        }
    });

    storelogin.fetch(function () {
        var data = this.data();
        if (data[0][0].Output_ID == 1) {
            app.notify.success(data[0][0].Output_Message);
            $("#modalview-forgotpassword").kendoMobileModalView("close");
            app.utils.loading(false);
        }
        else {
            app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}


