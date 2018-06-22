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
            let icon = $("<i>").text("create");
            icon.addClass("material-icons");
            let button = $("<button>").addClass("job-btn");
            button.val(data.id);
            button.append(icon);

            let order = $("<td>");
            order.append(button);
            
            let row = $("<tr>")
            row.append(first,last,phone, order);
            customer.append(row);
        })
    })
})

$(document).on('click', ".job-btn", function()  {
    $("#cust-tbl").empty();
    $("#tbl-data").addClass("hidden");
    $("last_search").val(" ")
    $("#cust-search").removeClass("hidden");
    
})
// function getCustomers() {
//     $.get("/api/customers", function(data) {
//       var rowsToAdd = [];
//       for (var i = 0; i < data.length; i++) {
//         rowsToAdd.push(createAuthorRow(data[i]));
//       }
//       renderAuthorList(rowsToAdd);
//       nameInput.val("");
//     });
//   }