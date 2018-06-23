$(document).on('click', '#add-cust', () =>  {
    newCustomer = {
        last: $("#last_name").val(),
        first: $("#first_name").val(),
        phone: $("#phone_number").val()
    }

    console.log(newCustomer);

    $.post("/api/customers", newCustomer);
})


$(document).on('click', '#get-cust', () =>  {
    let customer = $("#cust-tbl")
    $("#cust-search").addClass("hidden");
    $("#tbl-data").removeClass("hidden");
    

    $.get("/api/customers/" + $("#last_search").val()).then((result) =>  {
        console.log(result);
        result.forEach((data) => {
            console.log(data.first);
            let first = $("<td>").text(data.first);
            let last = $("<td>").text(data.last);
            let phone = $("<td>").text(data.phone);
            
            let iconCreate = $("<i>").text("create");
            iconCreate.addClass("material-icons");
            
            let buttonCreate = $("<button>").addClass("job-btn");
            buttonCreate.val(data.id);
            buttonCreate.append(iconCreate);

            let order = $("<td>");
            order.append(buttonCreate);

            let iconView = $("<i>").text("create")
            iconView.addClass("material-icons");

            let buttonView = $("<button>").addClass("view-btn")
            buttonView.val(data.id)
            buttonView.append(iconView);

            let viewLog = $("<td>").append(buttonView)
        
            
            let row = $("<tr>")
            row.append(first,last,phone, order, viewLog);
            customer.append(row);
        })
    })
})

$(document).on('click', ".job-btn", function()  {
    let customer = $(this).val();
    let customerId = $("<div>")
    customerId.addClass("hidden")
        .attr('id', 'customerId')
        .val(customer)
    $("#string-input").append(customerId);

    console.log($("#customerId").val())
    
    $("#cust-tbl").empty();
    $("#tbl-data").addClass("hidden");
    $("#last_search").val("")
    $("#cust-search").removeClass("hidden");
    
})

$(document).on('click', '#create-job', function()  {
        
    console.log("Button Working")
    
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
                text: "Job Created",
                icon: 'http://www.coachcowie.com/wp-content/uploads/2017/03/Restringing.jpg',
                button: "Job Created"
            })
        });
        $("#string").val("")
        $("#gauge").val("")
        $("#tension").val("")
        $("#racquet").val("")
        $("#comment").val("")
})

$(document).on('click', '.view-btn', function()  {
   
    let customer = $(this).val();
    console.log(customer);


    $.get("/api/string/" + customer).then((result) => {
        console.log(result);
    })
})

