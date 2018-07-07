function clearInputs() {
    $("input").val("");
}

function setAuto() {
    $.get("/api/customers").then((results) => {
        results.forEach((choices) => {
            let searchLast = choices.last;
            let searchPhone = choices.phone;

            let optionsLast = $("<option>").val(searchLast);
            let optionsPhone = $("<option>").val(searchPhone);

            $("#data-last").append(optionsLast);
            $("#data-phone").append(optionsPhone);
        })
    })
}

function formatPhoneNumber(s) {
    var s2 = ("" + s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
}

// Function for search customer button

function getSearchVal() {
    let newSearch = {
        last: $("#last-search").val(),
        phone: $("#phone-search").val()
    }
    nameValidate(newSearch);
}

function nameValidate(cust) {
    if (cust.last.length > 0 && cust.phone.length > 0) {
        searchLast(cust.last)
    } else if (cust.last.length > 0 && cust.phone.length <= 0) {
        searchLast(cust.last);
    } else if (cust.last.length <= 0 && cust.phone.length > 0) {
        searchPhone(cust.phone)
    } else if (cust.last.length <= 0 && cust.phone.length <= 0) {
        swal({
            icon: 'warning',
            text: 'Please search last name or phone number'
        }).then(function() {
            clearInputs();
        })
    }
}

function searchLast(value) {
    //Empty table data before 

    let search = value.toUpperCase();
    $.get(`/api/last/${search}`).then((result) => {
        //Validate user input, if none exist return to customer modal
        if (result.length <= 0 || result === null) {
            swal({
                icon: 'warning',
                text: 'No customer was found, add one now.'
            }).then(function() {
                addInput();
            })
        } else {
            clearInputs();
            printUnqSearch(result);
        }
    })
}

function searchPhone(value) {
    if (value.length !== 10) {
        swal({
            icon: 'warning',
            text: 'Please enter a valid phone number.'
        }).then(function() {
            clearInputs();
        })
    } else {
        $.get(`/api/phone/${value}`).then((result) => {
            if (result.length <= 0 || result === null) {
                swal({
                    icon: 'warning',
                    text: 'No customer was found, add one now.'
                }).then(function() {
                    addInput();
                })
            } else {
                clearInputs();
                printUnqSearch(result);
            }
        })
    }
}

function searchAll() {
    $.get("/api/customers").then((result) => {
        printUnqSearch(result);
    })
}

function printUnqSearch(value) {
    $("#content-container").empty();
    $("#title-header").empty();
    $("#title-header").text('View Customers')
    console.log(value);
    value.forEach((data) => {
        let number = formatPhoneNumber(data.phone)

        let cardDiv = $("<div>").addClass("col s12 m6")
        let card = $("<div>").addClass('card')

        let cardContent = $("<div>").addClass('card-content z-depth-3 blue-grey lighten-5')
        let name = $("<span>").text(`${data.first} ${data.last}`).addClass('card-title')
        let phone = $("<a>").addClass('btn light-blue z-depth-3 message-write').text(number).data('phone', data.phone)
        let actions = $("<div>").addClass('card-action').attr('id', 'grad')

        let viewLog = $("<a>")
            .addClass('btn lime accent-3 view-log z-depth-3 black-text')
            .val(data.id)
            .text('view logs')
        let addJob = $("<a>")
            .addClass('btn lime add-job accent-3 z-depth-3 black-text')
            .text('add job')
            .val(data.id)
            .data('customer', `${data.first} ${data.last}`)
        let deleteCustomer = $("<a>").addClass('btn pink accent-2 delete-btn z-depth-3').val(data.id)
        let deleteIcon = $("<i>").addClass('material-icons').text('delete')
        deleteCustomer.append(deleteIcon);

        actions.append(viewLog, addJob, deleteCustomer);
        cardContent.append(name, phone);
        card.append(cardContent, actions);
        cardDiv.append(card);
        $("#content-container").append(cardDiv);


    })
}

function addInput() {
    $("#content-container").empty();
    $("#title-header").empty();
    $("#title-header").text('Add New Customer')
    clearInputs();
    console.log("This is happening")

    let form = $("<form>").addClass("col s12 center").attr('id', 'grad')

    let row = $("<div>").addClass("row")

    let firstWrap = $("<div>").addClass("input-field col s12 m3")
    let firstIcon = $("<i>").addClass("material-icons prefix").text("account_circle");
    let firstInput = $("<input>").attr("id", "first_name").attr("type", "text").addClass('white z-depth-5')
    let firstLabel = $("<label>").attr("for", "first_name").text("First Name")

    let lastWrap = $("<div>").addClass("input-field col s12 m3")
    let lastIcon = $("<i>").addClass("material-icons prefix").text("account_circle");
    let lastInput = $("<input>").attr("id", "last_name").attr("type", "text").addClass('white z-depth-5')
    let lastLabel = $("<label>").attr("for", "last_name").text("Last Name")

    let phoneWrap = $("<div>").addClass("input-field col s12 m4")
    let phoneIcon = $("<i>").addClass("material-icons prefix").text("phone");
    let phoneInput = $("<input>").attr("id", "phone_number").attr("type", "text").addClass('white z-depth-5')
    let phoneLabel = $("<label>").attr("for", "phone_number").text("Phone (10 Digits)")

    let buttonIcon = $("<i>").addClass('material-icons black-text right').text('add')
    let button = $("<a>").addClass("lime accent-3 btn z-depth-3 black-text").text('Add').attr("id", "add-customer").append(buttonIcon)
    let buttonDiv = $("<div>").append(button).addClass('col s12 m2');

    firstWrap.append(firstIcon, firstInput, firstLabel);
    lastWrap.append(lastIcon, lastInput, lastLabel);
    phoneWrap.append(phoneIcon, phoneInput, phoneLabel);
    row.append(firstWrap, lastWrap, phoneWrap, $("<br>"), buttonDiv);
    form.append(row);
    $("#content-container").append(form);

}

function getCustomer() {
    let newCustomer = {
        first: $("#first_name").val().toUpperCase(),
        last: $("#last_name").val().toUpperCase(),
        phone: $("#phone_number").val()
    }

    customerValidate(newCustomer);

}

function customerValidate(cust) {
    if (cust.first.length && cust.last.length > 0 && cust.phone.length === 10) {
        console.log("Correct")
        addCustomer(cust)
    } else {
        console.log("Loser");
        swal({
            icon: 'warning',
            title: 'Invalid Input',
            text: 'Please enter all fields and a valid phone number'
        }).then(function() {
            clearInputs();
        })
    }
}

function addCustomer(cust) {
    $.post("/api/customers", cust).then((result) => {
        searchLast(result.last)
    })
}

function clickView() {
    let value = $(this).val();
    getLogsUnq(value);
}

function getLogsUnq(value) {
    $.get(`/api/id/${value}`).then((result) => {
        console.log(result)
        result.forEach((data) => {
            if (data.StringLogs.length > 0) {
                printLogs(data.StringLogs, result[0])
            } else {
                swal({
                    icon: 'warning',
                    title: 'No Log Found',
                    text: 'Add jobs for this customer.'
                }).then(() => {
                    printUnqSearch(result)
                })
            }
        })
    })
}

function printLogs(value, customer) {
    $("#content-container").empty();
    $("#title-header").empty()
    let phone = formatPhoneNumber(customer.phone)
    let customerHead = $("<h4>").text(`Logs for ${customer.first} ${customer.last}`)
    let newJobBtn = $("<a>").addClass('btn light-blue job-again')
        .val(customer.id)
        .text('add new job')
        .data('customer', `${customer.first} ${customer.last}`)
    $("#title-header").append(customerHead, newJobBtn);
    value.forEach((data) => {
        let col = $("<div>").addClass("col s12 m6 l4")
        let card = $("<div>")
        if (data.isDone === true) {
            card.addClass('card z-depth-2').attr('id', 'grad')
        } else {
            card.addClass('card pink accent-2 z-depth-4').attr('id', 'grad3')
        }
        let content = $("<div>").addClass('card-content white-text')



        let convert = moment(data.createdAt).add(1, 'day').format('L');
        let date = $("<span>").addClass('card-title').text(convert);

        let racquet = $("<span>").addClass('card-title').text(data.racquet);
        let info = $("<p>").text(`${data.string} ${data.gauge}: ${data.tension}lbs`)
        let reuse = $("<a>").addClass('btn lime accent-3 reuse-btn z-depth-3')
            .data("string", data.string)
            .data("gauge", data.gauge)
            .data("tension", data.tension)
            .data("racquet", data.racquet)
            .val(data.customerId);
        let reuseIcon = $("<i>").addClass('material-icons black-text').text('redo')
        reuse.append(reuseIcon)

        let deleteJob = $("<a>").addClass('lime accent-3 btn delete-job z-depth-4').val(data.id)
            .data('customerId', data.customerId);
        let deleteJobIcon = $("<i>").addClass('material-icons black-text').text('delete')
        deleteJob.append(deleteJobIcon)

        let btnGroup = $("<div>").append(reuse, deleteJob)

        if (data.comment != null) {
            if (data.comment.legnth != 0) {
                let commentBtn = $('<a>').addClass('lime accent-3 btn view-comment z-depth-5').data('comment', data.comment)
                let commentIcon = $("<i>").addClass('material-icons black-text').text('message')
                commentBtn.append(commentIcon)
                btnGroup.append(commentBtn);
            }
        }



        content.append(date, racquet, info, btnGroup);

        card.append(content);
        col.append(card);
        $("#content-container").prepend(col);

    })
}

function deleteCustomer() {
    swal({
            title: "Are you sure?",
            text: "Once deleted, the customer will be gone forever.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                let id = $(this).val();
                $.ajax({
                    method: "DELETE",
                    url: `/api/delete/${id}`
                }).then((result) => {
                    searchAll();
                })
            } else {
                searchAll();
            }
        });


}

function reuseCreate() {

    let newString = {
        string: $(this).data("string"),
        gauge: $(this).data('gauge'),
        tension: $(this).data('tension'),
        racquet: $(this).data('racquet'),

        customerId: $(this).val()
    }

    jobCreate(newString);
}

function jobCreate(value) {
    $.post("/api/string", value).then((result) => {
        getLogsUnq(result.customerId)
    })
}

function confirmDelete() {
    let id = $(this).val();
    let customer = $(this).data('customerId');
    swal({
            title: "Are you sure?",
            text: "Once deleted, the job will be gone forever.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                jobDelete(id, customer)
            } else {
                getLogsUnq(customer);
            }
        });
}


function jobDelete(id, customerId) {
    $.ajax({
        method: "DELETE",
        url: `/api/string/delete/${id}`
    }).then((result) => {
        getLogsUnq(customerId);
    })
}

function viewComment() {
    swal({
        icon: 'success',
        title: 'Comments',
        text: $(this).data('comment')
    })
}

function searchInput() {
    $("#content-container").empty();
    $("#title-header").empty();
    $("#title-header").text("Search Customer");

    let form = $("<form>").addClass('col s12 center').attr('id', 'grad')
    let row = $("<div>").addClass('row')
    let lastField = $('<div>').addClass('input-field col s12 m4')
    let lastIcon = $("<i>").addClass('material-icons prefix').text('account_circle');
    let lastInput = $("<input>").attr('id', 'last-search').attr('type', 'text').attr('list', 'data-last')
        .addClass('white z-depth-5')
    let lastLabel = $("<label>").attr('for', 'last-search').text('Last Name');
    let lastData = $("<datalist>").attr('id', 'data-last');
    lastField.append(lastIcon, lastInput, lastLabel, lastData);

    let phoneField = $('<div>').addClass('input-field col s12 m4')
    let phoneIcon = $("<i>").addClass('material-icons prefix').text('phone');
    let phoneInput = $("<input>").attr('id', 'phone-search').attr('type', 'text').attr('list', 'data-phone')
        .addClass('white z-depth-5')
    let phoneLabel = $("<label>").attr('for', 'phone-search').text('Telephone (10 Digits)');
    let phoneData = $("<datalist>").attr('id', 'data-phone');
    phoneField.append(phoneIcon, phoneInput, phoneLabel, phoneData);

    let buttonGroup = $("<div>").addClass('col s12 m4');
    let search = $("<a>").addClass('btn lime accent-3 z-depth-3 black-text').attr('id', 'search-customer').attr('title','Search Customer').text("search customer");
    let searchIcon = $("<i>").addClass('material-icons black-text right').text('search')
    search.append(searchIcon);
    
    let select = $("<a>").addClass('btn lime accent-3 z-depth-3 black-text col s12 m6 z-depth-3').text("Select All Customers").attr('id', 'search-all').attr('title', 'Select All Customers');
    let selectIcon = $("<i>").addClass('material-icons black-text right').text('select_all')
    select.append(selectIcon);
    
    let addNew = $("<a>").addClass('btn lime accent-3 z-depth-3 black-text col s12 m6 z-depth-3').attr('id', 'add-new').attr('title', 'Add New Customer').text("Add New Customer");
    let addNewIcon = $("<i>").addClass('material-icons black-text right').text('add')
    addNew.append(addNewIcon);
    let headBtn = $("<div>").addClass('row center').append(select,addNew)
    $("#title-header").append(headBtn);
    buttonGroup.append(search);

    row.append(lastField, phoneField, $("<br>"), buttonGroup);
    form.append(row);

    $('#content-container').append(form);
}

function jobInput() {

    $("#title-header").empty();
    $("#title-header").text(`Add a new job for ${$(this).data('customer')}`)
    $("#content-container").empty();

    let form = $("<form>").addClass('col s12 center').addClass('row').attr('id', 'grad')
    let row = $("<div>")

    let stringField = $('<div>').addClass('input-field col s12 m6')
    let stringIcon = $("<i>").addClass('material-icons prefix').text('gesture');
    let stringInput = $("<input>").attr('id', 'string-search').attr('type', 'text')
    .addClass('white z-depth-5')
    let stringLabel = $("<label>").attr('for', 'string-search').text('String');
    stringField.append(stringIcon, stringInput, stringLabel)

    let gaugeField = $('<div>').addClass('input-field col s6 m6')
    let gaugeIcon = $("<i>").addClass('material-icons prefix').text('gesture');
    let gaugeInput = $("<input>").attr('id', 'gauge-search').attr('type', 'text')
    .addClass('white z-depth-5')
    let gaugeLabel = $("<label>").attr('for', 'gauge-search').text('Gauge');
    gaugeField.append(gaugeIcon, gaugeInput, gaugeLabel)

    let tensionField = $('<div>').addClass('input-field col s6 m6')
    let tensionIcon = $("<i>").addClass('material-icons prefix').text('gesture');
    let tensionInput = $("<input>").attr('id', 'tension-search').attr('type', 'text')
    .addClass('white z-depth-5')
    let tensionLabel = $("<label>").attr('for', 'tension-search').text('Tension');
    tensionField.append(tensionIcon, tensionInput, tensionLabel)

    let racquetField = $('<div>').addClass('input-field col s12 m6')
    let racquetIcon = $("<i>").addClass('material-icons prefix').text('gesture');
    let racquetInput = $("<input>").attr('id', 'racquet-search').attr('type', 'text')
    .addClass('white z-depth-5')
    let racquetLabel = $("<label>").attr('for', 'racquet-search').text('Racquet');
    racquetField.append(racquetIcon, racquetInput, racquetLabel)

    let commentField = $('<div>').addClass('input-field col s12')
    let commentInput = $("<textarea>").attr('id', 'comment-search').addClass('materialize-textarea')
    .addClass('white z-depth-5')
    let commentLabel = $("<label>").attr('for', 'comment-search').text('Comments');
    commentField.append(commentInput, commentLabel)

    let buttonDiv = $('<div>').addClass('col s12 m3')
    let button = $('<a>').addClass('btn lime accent-3 black-text z-depth-3 get-job').data('customer-id', $(this).val())
        .text("Add String Job")
    buttonDiv.append(button);


    row.append(stringField, gaugeField, tensionField, racquetField, commentField, buttonDiv);
    form.append(row);
    $("#content-container").append(form);
}

function getJobVals() {

    let newJob = {
        string: $("#string-search").val(),
        gauge: $("#gauge-search").val(),
        tension: $("#tension-search").val(),
        racquet: $("#racquet-search").val(),
        comment: $("#comment-search").val(),
        customerId: $(this).data('customer-id')
    }

    if(newJob.string.length && newJob.gauge.length && newJob.tension.length && newJob.racquet.length > 0)  {
        swal({
            icon: 'success',
            title: 'Job Created',
            text: `${newJob.racquet}, ${newJob.string} ${newJob.gauge}, ${newJob.tension}lbs`
        }).then(function() {
            jobCreate(newJob);
        })
    } else  {
        swal({
            icon: 'warning',
            titel: 'Missing Input',
            text: 'You did not enter all the required fields'
        }).then(() =>  {
            clearInputs();
        })
    }


}

function writeMessage() {
    let phone = $(this).data('phone')
    console.log(phone)
    swal({
        icon: 'info',
        title: 'Message',
        content: {
            element: 'input',
            attributes: {
                placeholder: 'Type a message to send'
            }
        }
    }).then((result) => {
        if (result.length > 0) {
            let message = {
                phone: `+1${phone}`,
                message: result
            }
            messagePost(message)
           
        } else {
            swal({
                icon: 'error',
                text: 'You must enter a message to send'
            })
        }
    })
}

function messagePost(message)  {
    
    console.log(message)
    $.post(`/api/message/${message.phone}/${message.message}`).then(function(result)  {
        console.log(result);
    })
}

function viewQueue() {
    $.get("/api/string").then((result) => {
        if (result.length > 0) {
            $(".sidenav").sidenav('close');
            $("#title-header").empty();
            $('#title-header').text(`${result.length} String Jobs in Queue`)
            $("#content-container").empty();

            result.forEach((data) => {
                let col = $("<div>").addClass('col s12 m6')
                let card = $("<div>").addClass('card blue-grey lighten-5')
                let content = $("<div>").addClass('card-content')
                let c = data.customer
                let customer = $("<span>").text(`${c.first} ${c.last}`).addClass('card-title')
                let racquet = $("<h4>").text(data.racquet)
                let info = $("<p>").text(`${data.string} ${data.gauge}: ${data.tension}lbs`)

                let btnGroup = $('<div>').addClass('card-action').attr('id', 'grad')

                let complete = $("<a>").addClass('black-text job-done btn center lime accent-3').text('Mark Job Complete')
                    .data('jobId', data.id).data('phone', c.phone);
                let completeIcon = $("<i>").addClass('material-icons right').text('check_box')
                complete.append(completeIcon)
                btnGroup.append(complete);
                content.append(racquet, info, customer)
                card.append(content, btnGroup)
                col.append(card)
                $("#content-container").append(col)
            })
        } else {
            swal({
                icon: 'success',
                text: 'All jobs are completed.'
            }).then(() => {
                location.reload();
            })
        }
    })

}

function sendDone(phone) {


    $.post(`/api/message/+1${phone}`)
    swal({
        icon: 'success',
        title: 'Message Sent',
        text: `Confirmation was sent to customer at phone ${phone}`
    })
    
}

function updateQueue() {
    let id = $(this).data('jobId')
    let phone = $(this).data('phone');
    $.ajax({
        method: "PUT",
        url: `/api/string/${id}`
    }).then(function(result) {
        swal({
            icon: 'info',
            title: 'Job Done',
            text: 'Send message to customer or close to move on.',
            buttons: {
                cancel: 'Close',
                catch: 'Send Status'
            }
        }).then((result) => {
            console.log(result)
            if(result === null)  {
                viewQueue();
            } if(result === 'catch')  {
                sendDone(phone);
                viewQueue();
            }
        })
    })
}


$(document).ready(function() {
    $('.sidenav').sidenav();
    setAuto();
    searchInput();
    $(document).on('click', "#search-customer", getSearchVal);
    $(document).on('click', "#add-customer", getCustomer);
    $(document).on('click', '.view-log', clickView);
    $(document).on('click', '#search-all', searchAll);
    $(document).on('click', '.delete-btn', deleteCustomer)
    $(document).on('click', '.reuse-btn', reuseCreate)
    $(document).on('click', '.delete-job', confirmDelete)
    $(document).on('click', '.view-comment', viewComment)
    $(document).on('click', '#add-new', addInput)
    $(document).on('click', '.add-job', jobInput)
    $(document).on('click', '.get-job', getJobVals)
    $(document).on('click', '.job-again', jobInput)
    $(document).on('click', '.message-write', writeMessage)
    $(document).on('click', '.view-queue', viewQueue)
    $(document).on('click', '.job-done', updateQueue)
    $(document).on('click', '.conf-send', sendDone)
})