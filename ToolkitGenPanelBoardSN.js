jQuery.fn.exists = function () { return this.length > 0; };

$("#extrainput-dialog").on('shown', function () {
    FocusControl();
    $(this).draggable();
});

$("#alert-dialog").on('shown', function () {
    $("#btnCloseMess").focus();
    $(this).draggable();
});

$("#alert-dialog").on('hidden', function () {
    $("#PanelsToGenerate").focus();
});

$("#PanelsToGenerate").keypress(function (e) {
    if (e.which === 13) {
        if ($("#PanelsToGenerate").val().length > 0) {
            $("#ToolkitGenPanelBoardSN-form").submit();
        }
    }
});

if ($("#ShowExtraInputForm").val() != "") {
    if ($("#ShowExtraInputForm").val() === "TRUE") {
        window.onload = function () {
            ToShowExtraInputForm();
        }
    }
    $("#ShowExtraInputForm").val("");
};

function ToShowExtraInputForm() {
    var url = $("#ExtraInputUrl").val();
    $.ajax({
        type: "post",
        dataType: "html",
        contentType: 'application/json; charset=utf-8',
        url: url,
        success: function (response) {
            $("#extrainput-body").html(response);
            var messStr = $("#ShowErrorMessage").val();
            if (messStr ==="true") {
                $("#alert-text").html($("#ErrorMessage").val());
                $("#alert-dialog").modal('show');
                $("#ShowErrorMessage").val('');
                $("ErrorMessage").val('');
            }
            else {
            $('#extrainput-dialog').modal('show');
            FocusControl();
           }
        },
        cache: false
    });
};

ExtraValueKeyPress = function (e) {
    if (e.which === 13) {
        e.preventDefault();
        var url = $("#ExtraInputValidUrl").val();
        $.ajax({
            type: "post",
            dataType: "html",
            data: $('#extrainput-form').serialize(),
            async: false,
            url: url,
            success: function (response) {
                $("#extrainput-body").html("");
                $("#extrainput-body").html(response);
                $('#extrainput-dialog').modal('show');
                FocusControl();
                var messStr = $("#Message").val();
                if (messStr != "")
                    $('#extrainput-message').html('<div class="alert alert-error"><a class="close" data-dismiss="alert">&times;</a><span>' + messStr + '</span></div>');
                $("#Message").val('');
            },
            error: function () {
                $('#extrainput-message').html('<div class="alert alert-error"><a class="close" data-dismiss="alert">&times;</a><span>Failed to get data</span></div>');
            },
        });
    }
};

function btnEditSequence(id,message) {
    var url = $("#EditUrl").val();
    var data = {
        id: id
    };
    $.ajax({
        url: url,
        type: "post",
        dataType: "html",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function (response) {
            $("#extrainput-body").html(response);
            $('#extrainput-dialog').modal('show');
            FocusControl();
            if (message !=null) {
                $('#extrainput-message').html('');
                $('#extrainput-message').html('<div class="alert alert-error"><a class="close" data-dismiss="alert">&times;</a><span>' + message + '</span></div>');
            }
        },
        error: function () {
            $('#extrainput-message').html('<div class="alert alert-error"><a class="close" data-dismiss="alert">&times;</a><span>Failed to get data</span></div>');
        },
        cache: false
    });
};

$("#btnSaveData").click(function () {
    var url = this.getAttribute("data-url");
    var data =
        { numberOfPanelsToGenerate: $("#PanelsToGenerate").val() }
    $.ajax({
        type: "post",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        url: url,
        data: JSON.stringify(data),
        success: function (response) {
            if (response.success === "false") {
                if (response.missingid === "") {
                    $('#extrainput-message').html('<div class="alert alert-error"><a class="close" data-dismiss="alert">&times;</a><span>' + response.message + '</span></div>');
                }
                else {
                    btnEditSequence(response.missingid, response.message);
                }
            }
            else {
                if (response.success === "true") {
                    RedirectToNextTask();
                }
            }
        },
        cache: false
    })
});


ExtratrClick = function (id) {
    if (id != -1) {
        btnEditSequence(id,null);
    }
};

var RedirectToNextTask = function () {
    var redirectToNextTaskUrl = $("#MoveToNextTaskUrl").val();
    window.location.href = redirectToNextTaskUrl;
};

function FocusControl() {
    if ($("#SelectedDetailValue").exists()) {
        var value = $("#SelectedDetailValue").val();
        $("#SelectedDetailValue").val("");
        $("#SelectedDetailValue").focus().val(value);
    }
    if ($("#ValueID").exists()) {
        $("#ValueID").focus();
    }
    if ($("#FocusOnButton").exists()) {
        if ($("#FocusOnButton").val() === "TRUE") {
            $("#btnSaveData").focus();
            $("#FocusOnButton").val("");
        }
    }
}


