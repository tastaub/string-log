//==============================
//===Button Trigger Functions===
//==============================

// ** Add Customer Progression **

//Add Customer from main screen
function getCustVal()  {
    let newCustomer = {
        first: $("#first_name").val(),
        last: $("#last_name").val(),
        phone: $("#phone_number").val()
    }

    nameValidate(newCustomer);
}

function nameValidate(cust)  {
    clearInputs();
    if(cust.first.length && cust.last.length > 0 && cust.phone.length === 10)  {
        console.log("Correct")
        addCustomer(cust)
    } else  {
        console.log("Loser");
        swal({
            icon: 'warning',
            title: 'Invalid Input',
            text: 'Please enter all fields and a valid phone number'
        })
    }
}


function addCustomer(cust) {

        // POST newCustomer
        $.post("/api/customers", cust).then((result) => {
            //Search for new customer to trigger customer option modal
            searchCustomer(result.last)
        });

}

function searchCustomer(value) {
    //Empty table data before 
    
    let search = value.toUpperCase();
    $.get(`/api/customers/${search}`).then((result) => {
        //Validate user input, if none exist return to customer modal
        if (result.length <= 0 || result === null) {
            swal({
                icon: "warning",
                text: "No customer found"
            }).then(() => {
                //Reopen cust-mod
                $("#cust-mod").modal('open')
            })
        } else {
            $("#cust-mod-tb").empty();
            //Print search response and prompt customer options
            printSearch(result);
        }
    })
}

// ** Get Customer Progression

//GET all customers in the database
function getCustomers() {
    $("#cust-mod-tb").empty();
    $.get("/api/customers").then(printSearch);
}

function uniqueSearch()  {
    $("#last-search").empty();
    $("#search-mod").modal('close');
    let search = $("#last-search").val();
    
    searchCustomer(search);
    

}

function viewLogs() {
    $("#string-tbl").empty();
    $("#cust-mod").modal('close');

    let customer = $(this).val();
    console.log(`Customer: ${customer}`)
    $.get("/api/string/" + customer).then(printLog);
}


function printSearch(result) {
    clearInputs();
    result.forEach((data) => {
        console.log(data);
        //Print user name, table data has 3 columns
        let first = $("<td>").text(data.first);
        let last = $("<td>").text(data.last);
        let phone = $("<td>").text(data.phone);

        //Create button trigger to create new job **class job-btn**
        let buttonCreate = $("<button>").addClass("job-btn material-icons").text("add_to_queue").val(data.id);
        let order = $("<td>").append(buttonCreate);

        //Create button trigger view of customer (by id) job logs **class view-btn**
        let buttonView = $("<button>").addClass("view-btn material-icons").text("history").val(data.id);
        let viewLog = $("<td>").append(buttonView)

        let row = $("<tr>").append(first, last, phone, order, viewLog);
        $("#cust-mod-tb").append(row)
        $("#cust-mod").modal('open');

    })
}

function printLog(result) {
    result.forEach((data) => {
        //Print Customer Logs **Column length 4
        let string = $("<td>").text(`${data.string} ${data.gauge}: ${data.tension}`);
        let racquet = $("<td>").text(data.racquet);
        
        let comment = $("<td>")
        //Check if comment exists, if yes add button to view comment
        if (data.comment.length === 0) {
            comment.text(" ")
        } else {
            comment.text(data.comment);
        }
        //Convert date data to MMDDYYYY
        let convert = moment(data.createdAt).add(1, 'day').format('L');
        let date = $("<td>").text(convert)
        let row = $("<tr>")
        row.append(date, string, racquet, comment);
        
        //Selectors to populate customer string log table
        $("#string-tbl").append(row);
        $("#view-log").modal('open');
    })


}

function clearInputs()  {
    $("input").val("");
}

//GET Customer String Log






function jobCreate() {
    $("#cust-mod").modal('close');
    let customer = $(this).val();
    let customerId = $("<div>")
    customerId.addClass("hidden")
        .attr('id', 'customerId')
        .val(customer)
    $("#string-input").append(customerId);
    $("#job-create").modal('open');

}

function getJob() {

    let newString = {
        string: $("#string").val(),
        gauge: $("#gauge").val(),
        tension: $("#tension").val(),
        racquet: $("#racquet").val(),
        comment: $("#comment").val(),
        customerId: $("#customerId").val(),
    }
    $.post("/api/string", newString).then(() => {
        swal({
            text: "Job Added to Queue",
            icon: 'success',
            button: "Close"
        })
    });
    clearInputs();
}



function jobLog() {
    $.get('/api/string').then((result) => {
        if(result.length <= 0)  {
            swal({
                icon: 'success',
                title: 'Complete',
                text: 'All jobs are completed'
            })
        } else  {
            printJobs(result);
        }
    })
}

function printJobs(result)  {
   result.forEach((job) =>  {
        let c = job.customer
        let name = $("<td>")
            .text(`${c.first} ${c.last}: ${c.phone}`)
        let string = $("<td>")
            .text(`${job.string} ${job.gauge}: ${job.tension}lbs`)
        let info = $("<td>")
            .text(job.racuqet)
        let comment = $("<td>")
            if(job.comment.length <= 0)  {
                let button = $("<button>")
                    .addClass("comm-view material-icons")
                    .text("comment")
                    .data("comment", job.comment)
                comment.append(button);
            }
        let complete = $("<button>")
            .text('done')
            .data("jobId", job.id)
            .addClass("material-icons complete")
        let comData = $("<td>")
            .append(complete)
        let row = $("<tr>").append(name,string,info,comment, comData)
        $("#job-queue")
            .append(row)
        $("#queue-mod").modal('open');
   })
}

function setAuto()  {
    $.get("/api/customers").then((results) =>  {
        results.forEach((choices) => {
            let searchLast = choices.last;
            
            let options = $("<option>").val(searchLast);

            $("#last-data").append(options);
        })
    })
}



//Button Triggers
$(document).ready(() => {
    setAuto();
    //Initialize modals
    $(".modal").modal()
    //Add Customer 
    $(document).on('click', '#add-cust', getCustVal);
    //Search Customer
    $(document).on('click', '#unique-search', () => {
        $("#cust-mod-tb").empty();
        $("#cust-mod").modal('close');
        $("#search-mod").modal('open')
       
    });
    //GET Customers
    $(document).on('click', '#op-cust-mod', getCustomers);
    //GET and print customer string logs
    $(document).on('click', '.view-btn', viewLogs);
    //Open string job modal
    $(document).on('click', ".job-btn", jobCreate);
    //POST for job 
    $(document).on('click', '#create-job', getJob)
    //GET customer string log
    $(document).on('click', '#search-btn', () => {
        $("#cust-mod").modal('close');
        $("#search-mod").modal('open');
    })
    $(document).on('click', "#search-customer", uniqueSearch)
    $(document).on('click', '#job-logs', jobLog)
    $(document).on('click', '.comm-view', function() {
        swal({
            icon: "success",
            text: $(this).data("comment")
        })
    })
    $(document).on('click', '.complete', function() {
        $.post("/api/message")

        $("#queue-mod").modal('close')
        swal({
            icon: 'success',
            text: 'Job is done!'
        })

        let jobId = $(this).data("jobId");
        // $.ajax({
        //     method: "PUT",
        //     url: `/api/string/${jobId}`
        // }).then(function()  {
        //     $("#job-queue").empty();
        // })
    })

})