
'use strict';

(function () {
    var view = app.testanswerView = kendo.observable();
    var testanswerViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("testanswerView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            disableBackButton();
            $("#spanquestionnumber_answer").html('1');
            $("#btnnext_answer").text('Next');
            var defaultquestion = 0;
            fun_displayquestion_answer(defaultquestion);
        },
        goto_next_question: function () {
            $(".km-scroll-container").css("transform", "none");
            var defaultquestion = parseInt($("#spanquestionnumber_answer").html());
            fun_displayquestion_answer(defaultquestion);
            var totalquestions = parseInt($("#spantotalquestions_answer").html());
            if (totalquestions !== defaultquestion) {
                defaultquestion = defaultquestion + 1;
                $("#spanquestionnumber_answer").html(defaultquestion);
            }
        },
        goto_homeview: function () {
            app.navigation.navigatedashboard();
        }

    });

    view.set('testanswerViewModel', testanswerViewModel);
}());



function fun_displayquestion_answer(defaultquestion) {
    var questiondetails = JSON.parse(localStorage.getItem("question_details"));
    var userquestiondetails = JSON.parse(localStorage.getItem("user_answer_details"));
    var objdistinct_questions = JSON.parse(localStorage.getItem("distinct_questions"))[defaultquestion];
    var totalquestions = Enumerable.From(JSON.parse(localStorage.getItem("distinct_questions"))).ToArray().length;
    $("#spantotalquestions_answer").html(totalquestions);
    totalquestions = totalquestions - 1;
    if (defaultquestion == totalquestions) {
        $("#btnnext_answer").html('Finish');
    }
    if (objdistinct_questions == undefined) {
        $("#btnnext_answer").attr('disabled', 'disabled');
    }
    else {
        var objquestion = Enumerable.From(questiondetails)
            .Where("$.Question_ID==" + objdistinct_questions)
                .ToArray();
        var questionvalue = objquestion[0].Question;
        var questionid = objquestion[0].Question_ID;
        $("#hdnquestion_id_answer").val(questionid);
        $("#hdnquestion_type_master_id_answer").val(objquestion[0].Question_Type_Master_ID);
        $("#hdnquestion_option_type_master_id_answer").val(objquestion[0].Question_Option_Type_Master_ID);
        $("#headerquestion_answer").empty();
        $("#headerquestion_answer").append('' + questionvalue + '');
        var question_option_type_master_id = objquestion[0].Question_Option_Type_Master_ID;
        var question_option_master_id = objquestion[0].Question_Option_Type_Master_ID
        //693	62	Multiple Choices with Multi Answer
        //694	62	True_False
        //695	62	Multiple Choices with One Answer
        $("#hdnquestion_option_type_master_id_answer").val(question_option_type_master_id);
        // Question_ID	Question	Option	AdminAnswer	UserAnswer	FinalAnswer	Score 
        var ethosmastervaluesdata = JSON.parse(localStorage.getItem("user_answer_details"));
        var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
        .Where("$.Question_ID==" + objdistinct_questions)
            .ToJSON()); 
        var dataSource = new kendo.data.DataSource({
            data: ethosmastervaluesrecords,
            batch: true,
            schema: {
                model: { 
                    fields: { 
                        Option: { type: "string", editable: false },
                        AdminAnswer: { type: "string", editable: false },
                        UserAnswer: { type: "string", editable: false },
                        FinalAnswer: { type: "string", editable: false },

                    }
                }
            }
        });
        $("#tblquestionlist").kendoGrid({
            dataSource: dataSource,
            columns: [ 
               { enabled: false, title: "Options", field: "Option", editable: false, },
               {
                   enabled: false, title: "Actual", field: "AdminAnswer", editable: false,
                   template: "<i ' class='" + "# if (AdminAnswer == '1') { # " + "fa fa-2x fa-check greencolor" + "# } else { #" + "" + "# }#" + "' <i/>"
               },
                {
                    enabled: false, title: "Selected", field: "UserAnswer", editable: false,
                    template: "<i ' class='" + "# if (UserAnswer == '1') { # " + "fa fa-2x fa-check greencolor" + "# } else { #" + "" + "# }#" + "' <i/>"
                },
                {
                    enabled: false, title: "Result", field: "FinalAnswer", editable: false,
                    template: "<i ' class='" + "# if (FinalAnswer == '1') { # " + "fa fa-2x fa-check greencolor" + "# } else if (FinalAnswer == 'NA') { # " + " " + "# } else { #" + "fa fa-2x fa-close redcolor" + "# }#" + "' <i/>"
                },
                
            ],
            editable: false
        });

    }
}
 


