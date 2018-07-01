function clearInputs()  {
    $("input").val("");
}

function setAuto()  {
    $.get("/api/customers").then((results) =>  {
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
    var s2 = (""+s).replace(/\D/g, '');
    var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
  }

// Function for search customer button

function getSearchVal()  {
    let newSearch = {
        last: $("#last-search").val(),
        phone: $("#phone-search").val()
    }
    nameValidate(newSearch);
}

function nameValidate(cust)  {
    if(cust.last.length > 0 && cust.phone.length > 0)  {
        searchLast(cust.last)
    } else if(cust.last.length > 0 && cust.phone.length <= 0)  {
        searchLast(cust.last);
    } else if(cust.last.length <= 0 && cust.phone.length > 0)  {
        searchPhone(cust.phone)
    } else if(cust.last.length <= 0 && cust.phone.length <= 0)  {
        swal({
            icon: 'warning',
            text: 'Please search last name or phone number'
        }).then(function()  {
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
            addInput();
        } else {
            clearInputs();
            printUnqSearch(result);
        }
    })
}

function searchPhone(value)  {
    if(value.length !== 10)  {
        swal({
            icon: 'warning',
            text: 'Please enter a valid phone number.'
        }).then(function()  {
            clearInputs();
        })
    }
    else  {
        $.get(`/api/phone/${value}`).then((result) =>  {
            if(result.length <= 0 || result === null)  {
                swal({
                    icon: 'warning',
                    text: 'No customer was found.'
                }).then(function()  {
                    addInput();
                })
            } else  {
                clearInputs();
                printUnqSearch(result);
            }
        })
    }
}

function searchAll()  {
    $.get("/api/customers").then((result) =>  {
        printUnqSearch(result);
    })
}

function printUnqSearch(value)  {
    $("#content-container").empty();
    console.log(value);
    value.forEach((data) =>  {
        let number = formatPhoneNumber(data.phone)
        
        let cardDiv = $("<div>").addClass("col s12 m6")
        let card = $("<div>").addClass('card')
        
        let cardContent = $("<div>").addClass('card-content')
        let name = $("<span>").text(`${data.first} ${data.last}`).addClass('card-title')
        let phone = $("<p>").text(number)

        let actions = $("<div>").addClass('card-action lime accent-3')
        
        let viewLog = $("<a>")
        .addClass('btn light-blue darken-1 view-log')
        .val(data.id)
        .text('view logs')
        let addJob = $("<a>")
        .addClass('btn light-blue darken-1')
        .text('add job')
        let deleteCustomer = $("<a>").addClass('btn pink accent-2 delete-btn').val(data.id)
        let deleteIcon = $("<i>").addClass('material-icons').text('delete')
        deleteCustomer.append(deleteIcon);

        actions.append(viewLog, addJob, deleteCustomer);
        cardContent.append(name,phone);
        card.append(cardContent,actions);
        cardDiv.append(card);
        $("#content-container").append(cardDiv);


    })
}

function addInput()  {
    $("#content-container").empty();
    clearInputs();
    console.log("This is happening")
    
    let form = $("<form>").addClass("col s12")
    
    let row = $("<div>").addClass("row")

    let firstWrap = $("<div>").addClass("input-field col s3")
        let firstIcon = $("<i>").addClass("material-icons prefix").text("account_circle");
        let firstInput = $("<input>").attr("id", "first_name").attr("type", "text");
        let firstLabel = $("<label>").attr("for", "first_name").text("First Name")

    let lastWrap = $("<div>").addClass("input-field col s3")
        let lastIcon = $("<i>").addClass("material-icons prefix").text("account_circle");
        let lastInput = $("<input>").attr("id", "last_name").attr("type", "text");
        let lastLabel = $("<label>").attr("for", "last_name").text("Last Name")

    let phoneWrap = $("<div>").addClass("input-field col s3")
        let phoneIcon = $("<i>").addClass("material-icons prefix").text("phone");
        let phoneInput = $("<input>").attr("id", "phone_number").attr("type", "text");
        let phoneLabel = $("<label>").attr("for", "phone_number").text("Phone")

    let button = $("<a>").addClass("cyan-effect cyan btn").attr("id", "add-customer").text("Add Customer")

    firstWrap.append(firstIcon,firstInput,firstLabel);
    lastWrap.append(lastIcon,lastInput,lastLabel);
    phoneWrap.append(phoneIcon,phoneInput,phoneLabel);
    row.append(firstWrap,lastWrap,phoneWrap,$("<br>"),button);
    form.append(row);
    $("#content-container").append(form);

}

function getCustomer()  {
    let newCustomer = {
        first: $("#first_name").val().toUpperCase(),
        last: $("#last_name").val().toUpperCase(),
        phone: $("#phone_number").val()
    }

    customerValidate(newCustomer);

}

function customerValidate(cust)  {
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

function addCustomer(cust)  {
    $.post("/api/customers", cust).then((result) =>  {
        searchLast(result.last)
    })
}

function clickView()  {
    let value = $(this).val();
    getLogsUnq(value);
}

function getLogsUnq(value)  {
    $.get(`/api/id/${value}`).then((result) =>  {
        result.forEach((data) =>  {
            if(data.StringLogs.length > 0)  {
                printLogs(data.StringLogs)
            } else  {
                swal({
                    icon: 'warning',
                    title: 'No Log Found',
                    text: 'Add jobs for this customer.'
                }).then(() =>  {
                    printUnqSearch(result)
                })
            }
        })
    })
}

function printLogs(value)  {
    $("#content-container").empty();
    value.forEach((data) =>  {
        let col = $("<div>").addClass("col s12 m6")
        let card = $("<div>")
        if(data.isDone === true)  {
            card.addClass('card light-blue darken-2')
        } else  {
            card.addClass('card pink accent-2')
        }
        let content = $("<div>").addClass('card-content white-text')
            let convert = moment(data.createdAt).add(1, 'day').format('L');
            let date = $("<span>").addClass('card-title').text(convert);

            let racquet = $("<span>").addClass('card-title').text(data.racquet);
            let info = $("<p>").text(`${data.string} ${data.gauge}: ${data.tension}lbs`)
            content.append(date,racquet,info);
            let comment = $("<p>")
        if(data.comment.length > 0)  {
            comment.text(data.comment)
            content.append(comment)
        } else  {
            comment.text("~No Comment~");
            content.append(comment);
        }
        
        card.append(content);
        col.append(card);
        $("#content-container").prepend(col);
        
    })
}

function deleteCustomer()  {
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
            }).then((result) =>  {
                searchAll();
            })
        } else {
          searchAll();
        }
      });
    

}



$(document).ready(function()  {
    setAuto();
    $(document).on('click', "#search-customer", getSearchVal);
    $(document).on('click', "#add-customer", getCustomer);
    $(document).on('click', '.view-log', clickView);
    $(document).on('click', '#search-all', searchAll);
    $(document).on('click', '.delete-btn', deleteCustomer)
})