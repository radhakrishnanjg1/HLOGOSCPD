(function () {
    app.navigation = {
        logincheck: function () {
            //alert(app.user);
            if ($('#hdnLogin_ID').val() === 0) {
                return app.mobileApp.navigate('components/authenticationView/view.html');
            }
        }, 
        back: function () {
            app.mobileApp.navigate('#:back');
            app.utils.loading(false);
        },
        navigateNoAppId: function () {
            return app.mobileApp.navigate('components/missingSettingsView/noappidView.html');
        },
        navigateAuthentication: function () {
            return app.mobileApp.navigate('components/authenticationView/view.html');
        }, 
        //right side menu start
        navigatedashboard: function () {
            return app.mobileApp.navigate('components/dashboardView/view.html');
        },
        navigatetestwelcomeView: function () {
            return app.mobileApp.navigate('components/testwelcomeView/view.html');
        },
        navigatetestintroductionView: function () {
            return app.mobileApp.navigate('components/testintroductionView/view.html');
        },
        navigatetestcontentView: function () {
            return app.mobileApp.navigate('components/testcontentView/view.html');
        },
        navigatetest: function () {
            return app.mobileApp.navigate("components/testView/view.html");
        }, 
        navigatetestthankyouView: function () {
            return app.mobileApp.navigate('components/testthankyouView/view.html');
        },
        navigatestanswerView: function () {
            return app.mobileApp.navigate('components/testanswerView/view.html');
        },
        navigatetesthistoryView: function () {
            return app.mobileApp.navigate('components/testhistoryView/view.html');
        },
        //left side menu  start  
        navigatechangepassword: function () {
            return app.mobileApp.navigate('components/changepasswordView/view.html');
        },
        navigateupdateprofile: function () {
            return app.mobileApp.navigate('components/updateprofileView/view.html');
        },
        navigatesignout: function () {
            var confirmation = "Are you sure you want to log out?";
            app.notify.confirmation(confirmation, function (confirm) {
                if (!confirm) {
                    return;
                }
                return app.mobileApp.navigate('components/authenticationView/view.html?action=logout');
            })
        },

        navigatesupport: function () {
            return app.mobileApp.navigate('components/supportView/view.html');
        },
        //left side menu  end         
        
        //common page for offline and GPS disabled
        navigateoffline: function (redirect) {
            return app.mobileApp.navigate('components/offlineView/view.html?pageid=' + redirect);
        },  
    };
}());