$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyCeOYF1FXNmEE_T070Oox-LHG7GlSiqvuE",
        authDomain: "train-scheduler-ec86d.firebaseapp.com",
        databaseURL: "https://train-scheduler-ec86d.firebaseio.com",
        projectId: "train-scheduler-ec86d",
        storageBucket: "",
        messagingSenderId: "1044761776522",
        appId: "1:1044761776522:web:8f4f6209f259af1758b873"
    };
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    $("#submit-button").on("click", function (event) {
        event.preventDefault();
        var trainName = $("#train-name-input").val();
        var destination = $("#destination-input").val()
        var firstTrainTime = $("#train-time-input").val();
        var frequency = $("#frequency-input").val();
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    database.ref().on("child_added", function (snapshot) {  // LOOKS LIKE ANY OPERATION YOU DO WITH MOMENT, YOU HAVE TO GIVE IT THE TIME FOLLOWED BY ", HH:mm, or whatever format it is"

    // "moment(time, its format)".  always give moment method the format of the time you are giving it

    console.log("EXAMPLE:  10 'oclock AM was " + moment().diff(moment("10:00", "HH:mm"), "minutes") + " minutes ago");

        console.log(snapshot.val());
        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var firstTrainTime = snapshot.val().firstTrainTime;  
        var frequency = snapshot.val().frequency;

        /*var firstTrainTimeFormat = moment(firstTrainTime, "HH:mm"); // define what format it is
        var convertedFirstTrainTime = firstTrainTimeFormat.format("HH:mm");      
        console.log(convertedFirstTrainTime);
        var timeNow = moment();
        var timeNowFormat = moment(timeNow, "HH:mm");
        var convertedTimeNow = timeNowFormat.format("HH:mm");*/

        var timeDifference = moment().diff(moment(firstTrainTime, "HH:mm"), "minutes"); // gives a number

        console.log(timeDifference);

        var remainder = timeDifference % frequency;
        var minutesAway = frequency - remainder;

        console.log(minutesAway);
        
        var nextArrival = moment().add(minutesAway, "minutes");
        var convertedNextArrival = moment(nextArrival, "X").format("HH:mm")
        
        var newRowtag = "<tr>";
        var newTd1 = "<td>" + trainName + "</td>";
        var newTd2 = "<td>" + destination + "</td>";
        var newTd3 = "<td>" + frequency + "</td>";
        //var newTd3 = "<td>" + firstTrainTime + "</td>";
        var newTd4 = "<td>" + convertedNextArrival + "</td>";
        var newTd5 = "<td>" + minutesAway + "</td>";

        var editButton = $("<button>");
        editButton.addClass("editButton");
        editButton.text("Edit Train Information");
        console.log(editButton);


        var newTd6 = "<td>" + $("<div>").addClass("testDiv") + "</td>";
        
        $(".testDiv").append("editButton");

        var newRowEndTag = "</tr>";
        $("#train-schedule-table").append(newRowtag + newTd1 + newTd2 + newTd3 + newTd4 + newTd5 + newTd6  + newRowEndTag);
        $("#train-schedule-table").append(editButton);

    });


});


  /*

        var convertedTime = moment(firstTrainTime, firstTrainTimeFormat);  // use moment method on start date and its format
        convertedTime.format("X")  // format it to something else if you wanted

        console.log(firstTrainTime);
        var monthsWorked = moment().diff(moment(convertedDate,"X"), "months") // get the difference of converted date in the parameter you want

        */