import express from "express";
const app = express();
const port = 3000;


app.use(express.json());

let routes = [
    { id: 1, name: "listenmusic", description: "The description describes all about listening music", done: true, reoccuring: false },
    { id: 2, name: "playcricket", description: "The description describes all about playing cricket", done: false, reoccuring: false },
    { id: 3, name: "watchmovies", description: "The description describes all about watching movies", done: false, reoccuring: false },
    { id: 4, name: "brush", description: "The description describes all about brushing your teeth", done: true, reoccuring: true, reoccuringType: "daily" },
    { id: 5, name: "Breakfast", description: "The description describes all about eating breakfast", done: true, reoccuring: true, reoccuringType: "weekly" }
];


app.listen(port, () => {
    console.log(`Successfully running on port ${port}`);
})
app.get("/routes", (req, res) => {
    res.json(routes);
})

app.get(`/todo/`, (req, res) => {
    res.json(routes);
});

app.get("/todo/filter", (req, res) => {
    const { done } = req.query;
    console.log(done);
    let arrayAfterFiltering
    if (done === "true") {
        arrayAfterFiltering = routes.filter(item => item.done);
    } else {
        arrayAfterFiltering = routes.filter(item => !item.done);
    }

    res.json(arrayAfterFiltering)

})

// app.get("/todo/reocurring", (req, res) => {
//     const { type, reoccuringType } = req.query;
//     console.log(type);
//     console.log(reoccuringType);

//     let reocurringArray;
//     let notReoccuringArray;
//     if (type === "true") {
//         console.log("happy")
//         reocurringArray = routes.filter(item => item.reoccuring)
//     }
//     else {
//         console.log("sad")

//         notReoccuringArray = routes.filter(item => !item.reoccuring)
//     }
//     // const date = new Date();
//     // const currentTime = date.getHours();
//     // const currentSeconds = date.getSeconds();

//     let intervalId;
//     let toggleDone;
//     // console.log(currentTime);

//     if (reoccuringType === "daily") {
//         console.log("happy happy ")
//         toggleDone = () => {
//             reocurringArray.forEach(item => {
//                 item.done = !item.done;
//             });
//         };
//         intervalId = setInterval(() => {
//             toggleDone();
//             res.json(reocurringArray);

//         }, 3000)



//     }

//     // intervalId = setInterval(toggleDone, 30000)



//     if (reoccuringType === "weekly") {
//         toggleDone = () => {
//             reocurringArray.forEach(item => {
//                 item.done = !item.done;
//             });
//             res.json(reocurringArray);
//         };


//         intervalId = setInterval(toggleDone, 3000)



//     }


//     // if (type === "true") {
//     //     res.json(reocurringArray)
//     // }

//     if (type === "false") {
//         res.json(notReoccuringArray)
//     }

// })

let reoccurringArray = [];
let intervalIdDaily;
let intervalIdWeekly;

const toggleDoneDaily = () => {
    reoccurringArray.filter(item => item.reoccuringType === "daily").forEach(item => {
        item.done = !item.done;
    });
    console.log("Daily Toggled", reoccurringArray.filter(item => item.reoccuringType === "daily"));
};

const toggleDoneWeekly = () => {
    reoccurringArray.filter(item => item.reoccuringType === "weekly").forEach(item => {
        item.done = !item.done;
    });
    console.log("Weekly Toggled", reoccurringArray.filter(item => item.reoccuringType === "weekly"));
};

const startToggling = (reoccuringType) => {
    clearInterval(intervalIdDaily);
    clearInterval(intervalIdWeekly);

    if (reoccuringType === "daily") {
        intervalIdDaily = setInterval(() => {
            toggleDoneDaily();
        }, 5000);
    }

    if (reoccuringType === "weekly") {
        intervalIdWeekly = setInterval(() => {
            toggleDoneWeekly();
        }, 10000);
    }
};

app.get("/todo/reocurring", (req, res) => {
    const { type, reoccuringType } = req.query;

    if (type === "true") {
        reoccurringArray = routes.filter(item => item.reoccuring);
    } else {
        reoccurringArray = routes.filter(item => !item.reoccuring);
    }

    if (reoccuringType === "daily" || reoccuringType === "weekly") {
        startToggling(reoccuringType);
    }

    if (type === "false") {
        res.json(routes.filter(item => !item.reoccuring));
    } else {
        res.json(reoccurringArray);
    }
});


app.get("/todo/:id", (req, res) => {
    const todoId = req.params.id;
    console.log(todoId);

    const extractedId = parseInt(todoId);
    console.log(extractedId);

    const result = routes.find(item => item.id === extractedId);
    if (result === undefined) {
        res.send("the item you have requested does not exist");
    }
    res.json(result);


});


app.delete("/todo/:id", (req, res) => {
    const todoId = req.params.id;

    const extractedId = parseInt(todoId);

    const elementToBeRemoved = routes.find(item => item.id === extractedId);

    console.log("The El to be removed", elementToBeRemoved);
    const arrayAfterDeleting = routes.filter(item => item !== elementToBeRemoved);

    console.log(arrayAfterDeleting);


    // const indextoRemove = extractedId - 1;
    // console.log(indextoRemove);

    let isTrue = true;

    if (arrayAfterDeleting.length !== routes.length) {
        isTrue = true;
    }





    // if(isTrue === true){
    //     res.send("Successfully deleted");
    // }else{
    //     res.send("Nothing left to be deleted");
    // }

    routes = routes.filter(item => arrayAfterDeleting.includes(item));

    console.log(arrayAfterDeleting);
    res.json(routes);

})


app.patch("/todo/:id", (req, res) => {
    // res.send("Patch successfully completed");

    const updateId = req.params.id;

    const extractedId = parseInt(updateId);

    let updatedDone = req.body.done;
    let updatedName = req.body.name;
    let updatedDescription = req.body.description;
    let updatedReoccuring = req.body.reoccuring;
    let updatedReoccuringType = req.body.reoccuringType;



    console.log(updatedDone);
    console.log(updatedName);
    console.log(updatedDescription);
    console.log(updatedReoccuring);
    console.log(updatedReoccuringType);

    console.log(extractedId);


    if (updatedName) {
        routes.forEach(item => {
            if (item.id === extractedId) {
                item.name = updatedName;
            }
        });
    }
    if (updatedDone) {
        routes.forEach(item => {
            if (item.id === extractedId) {
                item.done = updatedDone;
            }
        });
    }

    if (updatedDescription) {
        routes.forEach(item => {
            if (item.id === extractedId) {
                item.description = updatedDescription;
            }
        });
    }

    if (updatedReoccuring) {
        routes.forEach(item => {
            if (item.id === extractedId) {
                item.reoccuring = updatedReoccuring;
            }
        });
    }

    if (updatedReoccuringType) {
        routes.forEach(item => {
            if (item.id === extractedId) {
                item.reoccuringType = updatedReoccuringType;
            }
        });
    }


    res.json(routes);



})


app.post("/todo", (req, res) => {
    const id = routes.length + 1;
    const name = req.body.name;

    const newRoute = { id, name, done, reoccuring };
    console.log(name);
    routes.push(newRoute);

    res.json(routes);

});

function remove(arr, indextoRemove) {

    console.log("works");

    const removedEl = arr.splice(indextoRemove, 1);
    console.log(removedEl);

    console.log(`there are ${removedEl.length} elements in the removedEl array`);
    if (removedEl.length === 1) {
        return true;


    } else {
        return false;
    }

}



app.put("/todo/:id", (req, res) => {
    const idToPut = req.params.id;
    const id = parseInt(idToPut);

    const name = req.body.name;
    const done = req.body.done;
    const reoccuring = req.body.reoccuring;

    const description = req.body.description;

    const updatedcontent = { id, name, description, done, reoccuring };

    console.log(toPut(id, updatedcontent));

    res.json(routes);

});



function toPut(idToPut, updatedcontent) {

    const index = routes.findIndex(item => item.id === idToPut);

    if (index !== -1) {
        routes[index] = updatedcontent
    }
};


