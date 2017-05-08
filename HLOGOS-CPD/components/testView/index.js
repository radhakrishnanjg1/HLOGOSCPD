
'use strict';

(function () {
    var view = app.testView = kendo.observable();
    var testViewModel = kendo.observable({
        onShow: function ( ) { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("testView");
            }
            app.navigation.logincheck();  
        },
        afterShow: function () {
            disableBackButton();
            $('#paneltestnote').show();
            $('#hdnstr_testanswer_details').val('');
            $("#spanquestionnumber").html('1');
            $("#btnnext").text('Next');
            var defaultquestion = 0;
            fun_displayquestion(defaultquestion);
        },
        goto_next_question: function () {
            $(".km-scroll-container").css("transform", "none");
            $('#paneltestnote').hide(); 
            var defaultquestion = parseInt($("#spanquestionnumber").html());
            var inputid = "";
            var inputvalue = "";
            var question_option_master_id = 0;
            var firsttest = JSON.parse(localStorage.getItem("test_details")); 
            var Lesson_Test_ID = firsttest[0].Lesson_Test_ID;
            var Lesson_ID = firsttest[0].Lesson_ID;
            var Question_ID = parseInt($('#hdnquestion_id').val());
            var Question_Type_Master_ID = parseInt($('#hdnquestion_type_master_id').val());
            var Question_Option_Type_Master_ID = parseInt($('#hdnquestion_option_type_master_id').val());
            var Question_Option_Answer_ID = 0;
            var Option_URL = "";
            var Test_Flow_ID = 0;
            //var TEST_START = 0;
            //var TEST_END = 0;
            app.delete_employee_questions_by_questionid(Question_ID);
            if (Question_Option_Type_Master_ID == "693")//Multi-Choice
            {
                inputvalue = [];
                inputvalue = $("#dvmultichoice input[type='checkbox']:checked");
                inputid = [];
                var multichoicelimit = parseInt($("#spanmultichoicecount").html());
                if (inputvalue.length == 0) {
                    app.notify.error("Select an option for a question!");
                    return false;
                }
                if (inputvalue.length != multichoicelimit) {
                    app.notify.error('Select ' + multichoicelimit + ' options for a question!');
                    return false;
                }
                else {
                    $(inputvalue).each(function (i) {
                        inputvalue[i] = $(this).val();
                        inputid[i] = $(this).attr('id');
                        Question_Option_Answer_ID = parseInt($(this).attr('id'));
                        Test_Flow_ID = parseInt($(this).attr('test_flow_id'));
                        app.addto_employee_questions(Lesson_Test_ID, Lesson_ID, Question_ID,
                        Question_Type_Master_ID, Question_Option_Type_Master_ID, Question_Option_Answer_ID,
                        Option_URL, Test_Flow_ID );
                    });
                }
            }
            else if (Question_Option_Type_Master_ID == "695") //Single-Choice
            {
                inputvalue = $("#dvsinglechoice input[type='radio']:checked").val();
                question_option_master_id = $("#dvsinglechoice input[type='radio']:checked").attr('id');
                if (inputvalue == undefined || inputvalue == "") {
                    app.notify.error("Select an option for a question!");
                    return false;
                }
                else { 
                    Question_Option_Answer_ID = parseInt($("#dvsinglechoice input[type='radio']:checked").attr('id'));
                    Test_Flow_ID = parseInt($("#dvsinglechoice input[type='radio']:checked").attr('test_flow_id'));

                    app.addto_employee_questions(Lesson_Test_ID, Lesson_ID, Question_ID,
                    Question_Type_Master_ID, Question_Option_Type_Master_ID, Question_Option_Answer_ID,
                    Option_URL, Test_Flow_ID );
                }
            }
            else if (Question_Option_Type_Master_ID == "694") //True-False
            {
                inputvalue = $("#dvtruefalse input[type='radio']:checked").val();
                
                if (inputvalue == undefined || inputvalue == "") {
                    //$("#h3errormessage").html('Select an option for a question!');
                    //$("#modalview-error").kendoMobileModalView("open");
                    //return;
                    app.notify.error("Select an option for a question!");
                    return false;
                }
                else {
                    var questiondetails = JSON.parse(localStorage.getItem("question_details"));
                    var options = Enumerable.From(questiondetails)
                                 .Where("$.Question_ID==" +
                                 Question_ID + " && $.Option== '" + inputvalue + "'").ToJSON();
                    var idvalue = JSON.parse(options)[0].Question_Option_Answer_ID;
                    Question_Option_Answer_ID = idvalue; 
                    Test_Flow_ID = JSON.parse(options)[0].Test_Flow_ID;
                    app.addto_employee_questions(Lesson_Test_ID, Lesson_ID, Question_ID,
                    Question_Type_Master_ID, Question_Option_Type_Master_ID, Question_Option_Answer_ID,
                    Option_URL, Test_Flow_ID );
                }
            }
            fun_displayquestion(defaultquestion);
            var totalquestions = parseInt($("#spantotalquestions").html());
            if (totalquestions !== defaultquestion)
            {
                defaultquestion = defaultquestion + 1;
                $("#spanquestionnumber").html(defaultquestion);
            } 
        }

    });

    view.set('testViewModel', testViewModel);
}());
 
 
function closemodalviewerror() {
    $("#modalview-error").kendoMobileModalView("close");
}

function tocompletetest() {
    if ($("#btnnext").text() == 'Finish') {
        //$("#spantestrightarrow").hide();
        //$("#spantestsave").show();
        fun_get_test_data();
        var confirmation = "Are you sure you want to submit the details?";
        app.notify.confirmation(confirmation, function (confirm) {
            if (!confirm) {
                return;
            }
            fun_save_test_details();
        }); 
    } 
} 
 
function fun_save_test_details() { 
     
    var firstqtest = JSON.parse(localStorage.getItem("test_single"));
     var imageurl = firstqtest[0].Lesson_Test_ID;
    app.utils.loading(true); 
    var Employee_ID = parseInt($("#hdnEmployee_ID").val());
    var Sub_Territory_ID = parseInt($("#hdnEmployee_ID").val());
    var Lesson_Test_ID = parseInt(firstqtest[0].Lesson_Test_ID);
    var Lesson_Test_Start_Date = firstqtest[0].Schedule_From_Date;
    var Lesson_Test_End_Date = firstqtest[0].Schedule_From_Date;
    var Lesson_ID = parseInt(firstqtest[0].Lesson_ID);
    var Lesson_Start_Date = "";
    var Lesson_End_Date = "";
    var Score = parseInt(0);
    var For_Month = parseInt(0);
    var For_Year = parseInt(0);
    var Created_By = parseInt($("#hdnLogin_ID").val());
    var Str_TestAnswer_Details = $("#hdnstr_testanswer_details").val();
    fun_db_APP_HLOGOS_Add_Employee_TestTaken_Details(
    Employee_ID, Sub_Territory_ID, Lesson_Test_ID,
    Lesson_Test_Start_Date, Lesson_Test_End_Date, Lesson_ID,
    Lesson_Start_Date, Lesson_End_Date, Score,
    For_Month, For_Year, Created_By,
    Str_TestAnswer_Details);
}

function fun_get_test_data() {
    var renderstr = function (tx, rs) {
        var valuedata = [];
        for (var i = 0; i < rs.rows.length; i++) {
            valuedata.push(rs.rows.item(i));
        }
        $("#hdnstr_testanswer_details").val(JSON.stringify(valuedata));
        }
    app.select_test_data(renderstr);
}

function fun_displayquestion(defaultquestion) {
    var questiondetails = JSON.parse(localStorage.getItem("question_details"));
    var objdistinct_questions = JSON.parse(localStorage.getItem("distinct_questions"))[defaultquestion];
    var totalquestions = Enumerable.From(JSON.parse(localStorage.getItem("distinct_questions"))).ToArray().length;
    $("#spantotalquestions").html(totalquestions);
    totalquestions = totalquestions - 1;
    if (defaultquestion == totalquestions) {
        $("#btnnext").html('Finish');
    }
    if (objdistinct_questions == undefined) {
        tocompletetest();
    }
    else {
        var objquestion = Enumerable.From(questiondetails)
            .Where("$.Question_ID==" + objdistinct_questions)
                .ToArray();
        var questionvalue = objquestion[0].Question;
        var questionid = objquestion[0].Question_ID;
        $("#hdnquestion_id").val(questionid);
        $("#hdnquestion_type_master_id").val(objquestion[0].Question_Type_Master_ID);
        $("#hdnquestion_option_type_master_id").val(objquestion[0].Question_Option_Type_Master_ID);
        $("#headerquestion").empty();
        $("#headerquestion").append('' + questionvalue + '');
        //var input_type = objquestion[0].INPUT_TYPE;
        var question_option_type_master_id = objquestion[0].Question_Option_Type_Master_ID;
        var question_option_master_id = objquestion[0].Question_Option_Type_Master_ID
        //693	62	Multiple Choices with Multi Answer
        //694	62	True_False
        //695	62	Multiple Choices with One Answer
        $("#hdnquestion_option_type_master_id").val(question_option_type_master_id);
        if (question_option_type_master_id == "693") //Multi-Choice
        {
            var objansweryesno = Enumerable.From(objquestion)
            .Where("$.AnswerYesNo==" + 1)
                .ToArray().length; 
            $("#spanmultichoicecount").html(objansweryesno);
            test_hideallcontrols();
            $("#dvmultichoice").show();
            //Assigning Options 
            var options = Enumerable.From(questiondetails)
                 .Where("$.Question_ID==" + objdistinct_questions).ToJSON();
            var optionscount = Enumerable
           .From(questiondetails)
           .Where("$.Question_ID==" + objdistinct_questions)
           .Select("$.Question_Option_Answer_ID")
           .Distinct().ToArray().length;

             $.each(JSON.parse(options), function (i, item) {
                $("#dvmultichoice input[type='checkbox']").eq(i).attr('id', item.Question_Option_Answer_ID);
                $("#dvmultichoice input[type='checkbox']").eq(i).attr('name', questionid);
                $("#dvmultichoice label").eq(i).attr('for', item.Question_Option_Answer_ID);
                $("#dvmultichoice input[type='checkbox']").eq(i).attr('value', item.Option);
                $("#dvmultichoice input[type='checkbox']").eq(i).attr('test_flow_id', item.Test_Flow_ID);
                $("#dvmultichoice label").eq(i).html(item.Option);
            });
            if (optionscount == 5) {
                $("#dvmultichoiceoption5").show();
                $("#dvmultichoiceoption6").hide();
                $("#dvmultichoiceoption7").hide();
            }
            else if (optionscount == 6) {
                $("#dvmultichoiceoption5").show(); 
                $("#dvmultichoiceoption6").show();
                $("#dvmultichoiceoption7").hide();
            }
            else if (optionscount == 7) {
                $("#dvmultichoiceoption7").show();
                $("#dvmultichoiceoption5").show();
                $("#dvmultichoiceoption6").show();
            } 
        }
        else if (question_option_type_master_id == "695") //Single-Choice
        {
            test_hideallcontrols();
            $("#dvsinglechoice").show();
            //Assigning Options 
            var options = Enumerable.From(questiondetails)
                 .Where("$.Question_ID==" + objdistinct_questions).ToJSON();
            var optionscount = Enumerable
           .From(questiondetails)
           .Where("$.Question_ID==" + objdistinct_questions)
           .Select("$.Question_Option_Answer_ID")
           .Distinct().ToArray().length;

            $.each(JSON.parse(options), function (i, item) {
                $("#dvsinglechoice input[type='radio']").eq(i).attr('id', item.Question_Option_Answer_ID);
                $("#dvsinglechoice input[type='radio']").eq(i).attr('name', questionid);
                $("#dvsinglechoice label").eq(i).attr('for', item.Question_Option_Answer_ID);
                $("#dvsinglechoice input[type='radio']").eq(i).attr('value', item.Option);
                $("#dvsinglechoice label").eq(i).html(item.Option);
                $("#dvsinglechoice input[type='radio']").eq(i).attr('test_flow_id', item.Test_Flow_ID);
                 
            });

            if (optionscount == 5) {
                $("#dvsinglechoiceoption5").show();
                $("#dvsinglechoiceoption6").hide();
                $("#dvsinglechoiceoption7").hide();
            }
            else if (optionscount == 6) {
                $("#dvsinglechoiceoption5").show();
                $("#dvsinglechoiceoption6").show();
                $("#dvsinglechoiceoption7").hide();
            }
            else if (optionscount == 7) {
                $("#dvsinglechoiceoption7").show();
                $("#dvsinglechoiceoption5").show();
                $("#dvsinglechoiceoption6").show();
            }
             
        }
        else if (question_option_type_master_id == "694")//True-False
        {
            test_hideallcontrols();
            $("#dvtruefalse").show(); 
        } 
    }
}
 
function test_hideallcontrols() {
    $('#dvmultichoice input:checkbox').removeAttr('checked');
    $('#dvsinglechoice input:radio').removeAttr('checked');
    $('#dvtruefalse input:radio').removeAttr('checked'); 
    $('#dvmultichoice').hide(); 
    $('#dvsinglechoice').hide();  
    $('#dvtruefalse').hide(); 
    $("#dvmultichoiceoption7").hide();
    $("#dvmultichoiceoption5").hide();
    $("#dvmultichoiceoption6").hide();  
    $("#dvsinglechoiceoption5").hide();
    $("#dvsinglechoiceoption6").hide();
    $("#dvsinglechoiceoption7").hide();
}

function fun_db_APP_HLOGOS_Add_Employee_TestTaken_Details(
    Employee_ID,    Sub_Territory_ID, Lesson_Test_ID,
    Lesson_Test_Start_Date,    Lesson_Test_End_Date, Lesson_ID,
    Lesson_Start_Date,    Lesson_End_Date, Score,
    For_Month,    For_Year, Created_By,
    Str_TestAnswer_Details
    ) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/99jwj3ksk913dzqv/Invoke/SqlProcedures/APP_HLOGOS_Add_Employee_TestTaken_Details",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                    "Lesson_Test_ID": Lesson_Test_ID,
                    "Lesson_Test_Start_Date": Lesson_Test_Start_Date,
                    "Lesson_Test_End_Date": Lesson_Test_End_Date,
                    "Lesson_ID": Lesson_ID,
                    "Lesson_Start_Date": Lesson_Start_Date,
                    "Lesson_End_Date": Lesson_End_Date,
                    "Score": Score,
                    "For_Month": For_Month,
                    "For_Year": For_Year,
                    "Created_By": Created_By,
                    "Str_TestAnswer_Details": Str_TestAnswer_Details,
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data;
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0][0].Output_ID == 1) {
            localStorage.setItem("test_successdetails",
                JSON.stringify(data[0]));
            localStorage.setItem("user_answer_details", JSON.stringify(data[1]));

            app.notify.success(data[0][0].Output_Message);
            app.utils.loading(false);
            app.delete_employee_questions();
            $('#hdnstr_testanswer_details').val('');
            localStorage.removeItem("test_details_live");
            localStorage.removeItem("test_history_details_live");
            app.navigation.navigatetestthankyouView();
        }
        else {
            app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}
