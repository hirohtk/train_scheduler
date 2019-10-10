$(document).ready(function () {
    /*
    function refreshPage() {
        location.reload();
    }
    setTimeout(refreshPage, 60000); // cheap way of updating all information every minute.  won't happen at the start of every minute though, depends on when user loads page
    */
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


        /*
            var newJqueryTd1 = $("<td>");
            newJqueryTd1.addClass("trainName");
            newJqueryTd1.html(trainName);
            var newJqueryTd2 = $("<td>").html(destination);
            var newJqueryTd3 = $("<td>").html(frequency);
            var newJqueryTd4 = $("<td>").html(convertedNextArrival);
            var newJqueryTd5 = $("<td>").html(minutesAway);
        */
        var newJqueryRow = $("<tr>");

        var newTd1 = "<td class=" + trainName + ">" + trainName + "</td>";
        var newTd2 = "<td>" + destination + "</td>";
        var newTd3 = "<td>" + frequency + "</td>";
        var newTd4 = "<td>" + convertedNextArrival + "</td>";
        var newTd5 = "<td>" + minutesAway + "</td>";
        var newTd6 = "<td><button class = removeButton>Remove</button></td>";
        var newTd7 = "<td><button class = editTrainButton>Edit</button></td> + </tr>";
        // storing all of this variable information in the newJqueryRow element itself so it can be referenced again by other functions 
        newJqueryRow.attr("trainName", trainName);
        newJqueryRow.attr("destination", destination);
        newJqueryRow.attr("frequency", frequency);
        newJqueryRow.attr("nextArrival", convertedNextArrival);
        newJqueryRow.attr("minutesAway", minutesAway);
        newJqueryRow.attr("snapshotKey", snapshotKey);
        newJqueryRow.append(newTd1 + newTd2 + newTd3 + newTd4 + newTd5 + newTd6 + newTd7);

        console.log(newJqueryRow.attr("trainName"));
    /*
        var removeButton = $("<button>");
        removeButton.addClass("removeButton");
        removeButton.text("Remove Train");

        var editTrainButton = $("<button>");
        editTrainButton.addClass("editTrainButton");
        editTrainButton.text("Edit Train Info");
    */
        $("#train-schedule-table").append(newJqueryRow);
        //$("#train-schedule-table").append(newRowtag + newTd1 + newTd2 + newTd3 + newTd4 + newTd5 + newRowEndTag);
        //newJqueryRow.append(removeButton);
        //newJqueryRow.append(editTrainButton);

        //$("." + trainName + "").append(editTrainNameButton);
        //newJqueryRow.append(editTrainButton);
        //newTd1.append(editTrainNameButton);





    });

    $(document).on("click", ".removeButton", function () { // dynamically created button needs to be referenced from document 
        //console.log($(this).parent().parent().attr("id")); vestigial as of 10/9/2019
        var snapshotKeySpecific = $(this).parent().parent().attr("snapshotKey"); // need to do parent of parent now because parent of buton used to just be the newJquery row, but now
        // since the button is in a <td>, the parent of THAT is the newJquery row
        // below had to be googled - essentially this was needed in order to specifically remove 
        var specificEntry = firebase.database().ref(snapshotKeySpecific);
        specificEntry.remove()
            .then(function () {
                console.log("Remove succeeded.")
            })
            .catch(function (error) {
                console.log("Remove failed: " + error.message)
            });
        //above had to be googled
        console.log($(this).parent().parent());
        $(this).parent().parent().remove(); // removing parent also removes the removeButton
    });

    $(document).on("click", ".editTrainButton", function () {

        $(this).parent().append("<br><input type=text id=nameChange placeholder='New Train Name'>");
        $(this).parent().append("<br><input type=text id=destinationChange placeholder='New Destination'>");
        $(this).parent().append("<br><input type=text id=frequencyChange placeholder='New Frequency'>");
        $(this).parent().append("<br><button type=submit id=changeButton>Submit Change</button>");
        //var capturedName = $(this).parent().attr("id");
        var snapshotKeySpecific = $(this).parent().parent().attr("snapshotKey");
        var specificEntry = firebase.database().ref(snapshotKeySpecific); //specificEntry points to a specific place in the database so it can be referenced below for an update

        var convertedNextArrival = $(this).parent().parent().attr("nextArrival"); // conserving the original values
        var minutesAway = $(this).parent().parent().attr("minutesAway"); // conserving the original values
        

        $("#changeButton").on("click", function () {
            //event.preventDefault();
            var nameChange = $("#nameChange").val();
            var destinationChange = $("#destinationChange").val();
            var frequencyChange = $("#frequencyChange").val();
            specificEntry.update({ trainName: nameChange });
            specificEntry.update({ destination: destinationChange });
            specificEntry.update({ frequency: frequencyChange });

            $(this).parent().parent().empty(); // decided to wipe out the entire row, add a new one below

            var trainName = nameChange;
            var destination = destinationChange;
            var frequency = frequencyChange;
            

            var newJqueryRow = $("<tr>");

            var newTd1 = "<td class=" + trainName + ">" + trainName + "</td>";
            var newTd2 = "<td>" + destination + "</td>";
            var newTd3 = "<td>" + frequency + "</td>";
            var newTd4 = "<td>" + convertedNextArrival + "</td>";
            var newTd5 = "<td>" + minutesAway + "</td> + </tr>";
            var newTd6 = "<td><button class = removeButton>Remove</button></td>";
            var newTd7 = "<td><button class = editTrainButton>Edit</button></td> + </tr>";
            // storing all of this variable information in the newJqueryRow element itself so it can be referenced again by other functions 
            newJqueryRow.attr("trainName", trainName);
            newJqueryRow.attr("destination", destination);
            newJqueryRow.attr("frequency", frequency);
            newJqueryRow.attr("nextArrival", convertedNextArrival);
            newJqueryRow.attr("minutesAway", minutesAway);
            newJqueryRow.attr("snapshotKey", snapshotKeySpecific);
            newJqueryRow.append(newTd1 + newTd2 + newTd3 + newTd4 + newTd5 + newTd6 + newTd7);
            /*
            var removeButton = $("<button>");
            removeButton.addClass("removeButton");
            removeButton.text("Remove Train");

            var editTrainNameButton = $("<button>");
            editTrainNameButton.addClass("editTrainButton");
            editTrainNameButton.text("Edit Train Info");
            */
            $("#train-schedule-table").append(newJqueryRow);
            //$("#train-schedule-table").append(newRowtag + newTd1 + newTd2 + newTd3 + newTd4 + newTd5 + newRowEndTag);
            //newJqueryRow.append(removeButton);
            //newJqueryRow.append(editTrainNameButton);

            location.reload();

        });


        
    });
});


/*

      var convertedTime = moment(firstTrainTime, firstTrainTimeFormat);  // use moment method on start date and its format
      convertedTime.format("X")  // format it to something else if you wanted

      console.log(firstTrainTime);
      var monthsWorked = moment().diff(moment(convertedDate,"X"), "months") // get the difference of converted date in the parameter you want

      */