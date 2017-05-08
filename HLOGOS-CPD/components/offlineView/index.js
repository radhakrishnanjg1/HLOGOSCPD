
'use strict';

(function () {
    var view = app.offlineView = kendo.observable();
    var offlineViewModel = kendo.observable({
        onShow: function (e) {
            var pageid = e.view.params.pageid;
            $('#hdncurrentpage').val(pageid); 
           // alert(e.view.params.pageid);
        },
        gotoonlinepage: function () {
            var page = $('#hdncurrentpage').val();
            if (app.utils.checkinternetconnection()) {
                return app.mobileApp.navigate('components/' + page + '/view.html');
            }
            app.navigation.navigateoffline(page);
        }
    });

    view.set('offlineViewModel', offlineViewModel);
}());
 
 