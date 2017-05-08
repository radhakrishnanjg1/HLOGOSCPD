'use strict';

(function () {
    var provider = app.data.defaultProvider;

    var view = app.profileView = kendo.observable();

    var validator;
    var profileViewModel = kendo.observable({
        profile: null,
        uploader: null,
        photoChanged: false,
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("updateprofileView");
            }
            app.navigation.logincheck();
            var userdata = JSON.parse(localStorage.getItem("userdata"));
                var profile = kendo.observable({
                    Email: userdata.Email,
                    Mobile: userdata.Mobile,
                    Username: userdata.Username,
                    Birthday: userdata.Birthday,
                    Designation: userdata.Designation,

                    //DisplayName: "Ram", 
                    //Birthday: "1965-12-12",
                    ////Gender: "1", 
                });
                this.set('profile', profile);
        },
        onHide: function () {

        },
        updateProfile: function () { 
            var profile = this.profile;
            var user = JSON.parse(localStorage.getItem("userdata"));
            var model = {
                Login_ID: user.Login_ID,
                Employee_ID: user.Employee_ID,
                Email: user.Email,
                Mobile: user.Mobile,
            };
            if (profile.Email === "") {
                app.notify.error('Enter email!');
                return;
            }
            else if (profile.Mobile === "") {
                app.notify.error('Enter mobile!');
                return;
            }
            else if (user.Mobile != profile.Mobile || user.Email != profile.Email) {
                // update profile in db
                fun_dbupdateprofiledetail(user.Login_ID, user.Employee_ID, profile.Email, profile.Mobile);
            }
            else {
                app.notify.error('Change the email or mobile!');
            } 
        }
    });

    view.set('profileViewModel', profileViewModel);
}());


function fun_dbupdateprofiledetail(Login_ID, Employee_ID, Email, Mobile) {
    var datacheck = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_Change_Profile_Details",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID, "Employee_ID": Employee_ID,
                    "Email": Email, "Mobile": Mobile
                }
            }
        },
        schema: {
            parse: function (response) {
                var data = response.Result.Data[0];
                return data;
            }
        }
    });
    app.utils.loading(true);
    datacheck.fetch(function () {
        var data = this.data();
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            app.navigation.navigateAuthentication();
            app.utils.loading(false);
        }
        else {
            app.notify.error(data[0].Output_Message);
        }
        app.utils.loading(false);
    });

}

