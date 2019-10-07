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



        var snapshotKey = snapshot.key;

        console.log(snapshotKey);

        //console.log(snapshot.val());
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

        //console.log(timeDifference);

        var remainder = timeDifference % frequency;
        var minutesAway = frequency - remainder;

        //console.log(minutesAway);

        var nextArrival = moment().add(minutesAway, "minutes");
        var convertedNextArrival = moment(nextArrival, "X").format("HH:mm")


        //var newRowtag = "<tr id=" + trainNumber + ">"; // needed to do this with Jquery intead, below

        var newJqueryRow = $("<tr>");
        var newTd1 = "<td class=" + trainName + ">" + trainName + "</td>";
        var newTd2 = "<td>" + destination + "</td>";
        var newTd3 = "<td>" + frequency + "</td>";
        var newTd4 = "<td>" + convertedNextArrival + "</td>";
        var newTd5 = "<td>" + minutesAway + "</td> + </tr>";

        newJqueryRow.attr("id", trainName);
        newJqueryRow.attr("snapshotKey", snapshotKey);
        newJqueryRow.append(newTd1 + newTd2 + newTd3 + newTd4 + newTd5);

        console.log(newJqueryRow.attr("id"));

        var removeButton = $("<button>");
        removeButton.addClass("removeButton");
        removeButton.text("Remove Train");

        var editTrainNameButton = $("<button>");
        editTrainNameButton.addClass("editNameButton");
        editTrainNameButton.text("Edit Train Name");

        $("#train-schedule-table").append(newJqueryRow);
        //$("#train-schedule-table").append(newRowtag + newTd1 + newTd2 + newTd3 + newTd4 + newTd5 + newRowEndTag);
        newJqueryRow.append(removeButton);

        //$("." + trainName + "").append(editTrainNameButton);
        //newJqueryRow.append(editTrainButton);
        //newTd1.append(editTrainNameButton);

        

        $(".editNameButton").on("click", function () {

            $(this).parent().append("<br><input type=text id=nameChange>")
            $(this).parent().append("<br><button type=submit id=nameChangeButton>Submit Change</button>");
            $("#nameChangeButton").on("click", function () {
                var nameChange = $("#nameChange").val();
                console.log(nameChange);
                database.ref().set({
                    trainName: nameChange,
                });
                //replaceWith("<td>" + 2 + "</td>")
            });



        });

    });
    
    $(document).on("click", ".removeButton", function () {
        console.log($(this).parent().attr("id"));  // checking to see if this is a way to successfully identify the correct parent element tr based on the id that is set.  
        console.log("CHECKING:" + $(this).parent().attr("snapshotKey"));
        var snapshotKeySpecific = $(this).parent().attr("snapshotKey");

        var specificEntry = firebase.database().ref(snapshotKeySpecific);
        specificEntry.remove()
            .then(function () {
                console.log("Remove succeeded.")
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });
        $(this).parent().remove(); // removing parent also removes the removeButton
    });


});


/*

      var convertedTime = moment(firstTrainTime, firstTrainTimeFormat);  // use moment method on start date and its format
      convertedTime.format("X")  // format it to something else if you wanted

      console.log(firstTrainTime);
      var monthsWorked = moment().diff(moment(convertedDate,"X"), "months") // get the difference of converted date in the parameter you want

      */