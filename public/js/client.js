//Take result from get response and print table data into modal
function printSearch(result)  {
    result.forEach((data) => {
        console.log(data);
        let first = $("<td>").text(data.first);
        let last = $("<td>").text(data.last);
        let phone = $("<td>").text(data.phone);
      
        let buttonCreate = $("<button>").addClass("job-btn material-icons").text("add_to_queue").val(data.id);
        let order = $("<td>").append(buttonCreate);
        
        let buttonView = $("<button>").addClass("view-btn material-icons").text("history").val(data.id);
        let viewLog = $("<td>").append(buttonView)
    
        let row = $("<tr>").append(first,last,phone, order, viewLog);
        $("#cust-mod-tb").append(row)
        $("#cust-mod").modal('open');
        
    })
}

function printLog(result)  {
    console.log(result)
    result.forEach((data) =>  {
        let string = $("<td>").text(data.string);
        let gauge = $("<td>").text(data.gauge);
        let tension = $("<td>").text(data.tension);
        let racquet = $("<td>").text(data.racquet);
        let comment = $("<td>")
        if(data.comment.length === 0)  {
            comment.text(" ")
        } else  {
            comment.text(data.comment);
        }
        let convert = moment(data.createdAt).add(1, 'day').format('L');
        let date = $("<td>").text(convert)
        let row = $("<tr>")
        row.append(date, string, gauge, tension, racquet, comment);
        $("#string-tbl").append(row);
        $("#view-log").modal('open');
    })
    

}
// Add customer POST then GET customer options
function addCustomer()  {
    newCustomer = {
        last: $("#last_name").val().toUpperCase(),
        first: $("#first_name").val().toUpperCase(),
        phone: $("#phone_number").val()
    }
// POST newCustomer
    $.post("/api/customers", newCustomer).then((result) =>  {
        //Search for new customer to trigger customer option modal
        $.get(`/api/customers/${result.last}`).then(printSearch)
    });
}
//GET customer from search value 
function searchCustomer()  {
    $("#cust-mod-tb").empty();
    $("#search-mod").modal('close');
        
    let search = $("#last_search").val().toUpperCase();
    $.get(`/api/customers/${search}`).then((result) =>  {
        //Validate user input, if none exist return to index
        if(result.length <= 0 || result === null)  {
            swal({
                icon: "warning",
                text: "No customer found"
            }).then(() =>  {
                $("#last_search").val("")
                $("#search-mod").modal('open');
            })
        } else  {
            //Print search response and prompt customer options
            printSearch(result);
        }
    })
}
//GET all customers in the database
function getCustomers()  {
    $("#cust-mod-tb").empty();
    $.get("/api/customers").then(printSearch);
}
//GET Customer String Log
function viewLogs()  {
    $("#string-tbl").empty();
    $("#cust-mod").modal('close');
    
     let customer = $(this).val();
     console.log(`Customer: ${customer}`)
     $.get("/api/string/" + customer).then(printLog);
}

// console.log(data);


function jobCreate()  {
    $("#cust-mod").modal('close');
    let customer = $(this).val();
    let customerId = $("<div>")
    customerId.addClass("hidden")
        .attr('id', 'customerId')
        .val(customer)
    $("#string-input").append(customerId);
    $("#job-create").modal('open');

}

function getJob()  {
        
    let newString = {
        string: $("#string").val(),
        gauge: $("#gauge").val(),
        tension: $("#tension").val(),
        racquet: $("#racquet").val(),
        comment: $("#comment").val(),
        customerId: $("#customerId").val(),
    }
    $.post("/api/string", newString).then(() =>  {
        swal({
            text: "Job Added to Queue",
            icon: 'success',
            button: "Close"
        })
    });
    $("#string").val("")
    $("#gauge").val("")
    $("#tension").val("")
    $("#racquet").val("")
    $("#comment").val("")
}


//Button Triggers
$(document).ready(() =>  {
    //Initialize modals
    $(".modal").modal()
    //Add Customer 
    $(document).on('click', '#add-cust', addCustomer);
    //Search Customer
    $(document).on('click', '#get-cust', searchCustomer);
    //GET Customers
    $(document).on('click', '#op-cust-mod', getCustomers);
    //GET and print customer string logs
    $(document).on('click', '.view-btn', viewLogs);
    //Open string job modal
    $(document).on('click', ".job-btn", jobCreate);
    //POST for job 
    $(document).on('click', '#create-job', getJob)
    //GET customer string log
    $(document).on('click', '#search-btn', () =>  {
        $("#cust-mod").modal('close');
        $("#search-mod").modal('open');
    })
    
})


















