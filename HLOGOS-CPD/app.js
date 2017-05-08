'use strict';

(function (global) {
    var app = global.app = global.app || {};
    window.app = app;


    // using sql db for storing offline information 
    app.openDb = function () {
        if (window.sqlitePlugin !== undefined) {
            app.db = window.sqlitePlugin.openDatabase("HLOGOSCPD102");
        } else {
            // For debugging in simulator fallback to native SQL Lite
            app.db = window.openDatabase("HLOGOSCPD102", "1.0", "Cordova Demo", 200000);
            //app.db = window.sqlitePlugin.openDatabase("EthosINS");
        }
    };

    var bootstrap = function () {
        var os = kendo.support.mobileOS,
      statusBarStyle = os.ios && os.flatVersion >= 700 ? 'white-translucent' : 'white';
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                //transition: 'slide',
                layout: "tabstrip-layout",
                skin: 'flat',
                initial: 'components/authenticationView/view.html',// DCRView approveleaveView
                statusBarStyle: statusBarStyle,

            });
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
                StatusBar.overlaysWebView(false); //Turns off web view overlay.
            }
            //if (device.platform === 'iOS' && parseFloat(device.version) >= 7.0) {
            //    document.body.style.marginTop = "20px";
            //} 
            bootstrap();

        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function (url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function (itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function (event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function (formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function (key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    

    // 1 create requird master informaton 
    app.createtable_employee_questions = function () {
        var db = app.db;
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS employee_questions(ID INTEGER PRIMARY KEY ASC,"
                    + "Lesson_Test_ID INTEGER,"
                    + "Lesson_ID INTEGER,"
                    + "Question_ID INTEGER,"
                    + "Question_Type_Master_ID INTEGER,"
                    + "Question_Option_Type_Master_ID INTEGER,"
                    + "Question_Option_Answer_ID INTEGER,"
                    + "Option_URL TEXT,"
                    + "Test_Flow_ID INTEGER,"
                    + "TEST_START BLOB,"
                    + "TEST_END BLOB,"
                    + " added_on BLOB)", []);
        });
    }

    // 2 insert dcr_master
    app.addto_employee_questions = function (Lesson_Test_ID, Lesson_ID, Question_ID,
        Question_Type_Master_ID, Question_Option_Type_Master_ID, Question_Option_Answer_ID,
        Option_URL, Test_Flow_ID
        ) {
        var TEST_START = todateddmmyyyhhmmss_hyphen(new Date());
        var TEST_END = todateddmmyyyhhmmss_hyphen(new Date());
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into employee_questions(Lesson_Test_ID, Lesson_ID, Question_ID,"
              + "Question_Type_Master_ID, Question_Option_Type_Master_ID, Question_Option_Answer_ID,"
              + "Option_URL, Test_Flow_ID, TEST_START, TEST_END,added_on) "
                + " values (?,?,?,?,?,?,?,?,?,?,?)",
                            [Lesson_Test_ID, Lesson_ID, Question_ID,
                            Question_Type_Master_ID, Question_Option_Type_Master_ID, Question_Option_Answer_ID,
                            Option_URL, Test_Flow_ID, TEST_START, TEST_END, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 3 Select  
    app.select_test_data = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM employee_questions  ", [], fn, app.onError);
        });
    };

    //4 Delete
    app.delete_employee_questions_by_questionid = function (Question_ID) {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from employee_questions where Question_ID = ?", [Question_ID],
                          app.onsuccess,
                          app.onError);
        });
    };

    app.delete_employee_questions = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from employee_questions ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    app.onError = function (tx, e) {
        alert(e.message);
        console.log("Error: " + e.message);
        //  app.hideOverlay();
    }

    app.onsuccess = function (tx, r) {
        // console.log("Your SQLite query was successful!");
        // app.refresh();
        // app.hideOverlay();
    }

}(window));

function app_db_init() {
    app.openDb();
    app.createtable_employee_questions();
    app.delete_employee_questions();
}

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp