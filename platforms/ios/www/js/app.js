//GLOBAL VARIABLE DECLARATIONS
var loadCount = 0;
var pplList;
var occList;
var giftListP;
var giftListO;
var db = null;
var parentCatch;
var textCatch;
var optCatch;
var liCatch;



//WAIT FOR BOTH DOMCONTENT AND DEVICE TO BE READY THEN START
document.addEventListener("DOMContentLoaded", function(){
    loadCount ++;
  
    if (loadCount === 1){
        
        start();
    };
});
document.addEventListener("deviceready",function(){
    loadCount ++;
    
     
    if (loadCount === 1){ 
   
        start();
    };
});


/*************************************************

                START FUNCTION
        
************************************************/        

function start(){
    
        //start database
        checkDB();

        pplList = document.getElementById("people-list");
        occList = document.getElementById("occasion-list");
        giftListP = document.getElementById("gifts-for-person");
        giftListO = document.getElementById("gifts-for-occasion");

        //Set the hammer listener for pages
        var ht = new Hammer(pplList);
        ht.on('swipeleft', swipePage);
        var ht2 = new Hammer(occList);
        ht2.on('swiperight', swipePage);
    
    
        //set the hammer listeners for the add buttons
        var btnAdd = document.getElementsByClassName("btnAdd");
        for (i=0;i<btnAdd.length;i++){
            var ht3 = new Hammer(btnAdd[i]);
            ht3.on('tap', showModal);
        }
        
        //set the hammer listeners for the modal save buttons
        var btnSave = document.getElementsByClassName("btnSave");
        for (x=0;x<btnSave.length;x++){
            var ht4 = new Hammer(btnSave[x]);
            ht4.on('tap', addJunction);
        }
        //set the hammer listeners for the modal cancel buttons
        var btnCancel = document.getElementsByClassName("btnCancel");
        for (y=0;y<btnCancel.length;y++){
            var ht5 = new Hammer(btnCancel[y]);
            ht5.on('tap', hideModal);
        }
    
        var doneBtn = document.getElementsByClassName("done");
        for (z=0;z<doneBtn.length;z++){
            var ht7 = new Hammer(doneBtn[z]);
            ht7.on('tap', hideGifts);
            
        }
    
    
        //load initial page
        swipePage(null);
    
};

/********************************************

        MODAL AND PAGE VIEW FUNCTIONS
    
*********************************************/

function showModal(ev){
    
    //save the parents id for later
    parentCatch = ev.target.offsetParent.id;
    
    //clear all input text fields
    var txt = document.querySelectorAll("[type=text]");
    
    for (x=0; x<txt.length;x++){
        
        txt[x].value = '';
    }
    
    if (ev.target.id == "addPpl"){
        
        //change the title of the modal window
        var header = document.getElementById("mainTitle");
        header.innerHTML = "Add a Friend";
        
        
        //show the modal
        document.getElementById("add-person-occasion").style.display="block";
        document.querySelector("[data-role=overlay]").style.display="block";
        
    }else if (ev.target.id == "addOcc"){
        
        //change the title of the modal window
        var header = document.getElementById("mainTitle");
        header.innerHTML = "Add an Occasion";
        
        //show the modal
        document.getElementById("add-person-occasion").style.display="block";
        document.querySelector("[data-role=overlay]").style.display="block";
         
    }else if (ev.target.id == "addGP"){
        
        //change the title of the modal window
        var header = document.getElementById("giftTitle");
        header.innerHTML = "Add a Gift";
              
        //show the modal
        document.getElementById("add-gift").style.display="block";
        document.querySelector("[data-role=overlay]").style.display="block";
    
        //add occasions from database to options list
        db.transaction(function(trans){
        
        trans.executeSql('SELECT * FROM occasions', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("occasion names found, added to list");
            
                                        var optList = document.getElementById("list-per-occ");
            
                                        //clear the list from previous and re-add the default value option
                                        optList.innerHTML = "";
                                        var dftl = document.createElement("option");
                                        dftl.setAttribute("value", 0);
                                        dftl.innerHTML = "Choose an Occasion";
                                        optList.appendChild(dftl);
            
                                        //update the list view
                                        var numList = rs.rows.length;
                                        for(var i=0; i<numList; i++){
                                            var newOpt = document.createElement("option");
                                            newOpt.setAttribute("value", rs.rows.item(i).occ_id );
                                            newOpt.innerHTML = rs.rows.item(i).occ_name;
                                            optList.appendChild(newOpt);
                                        }
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });

        });
        
        
    }else if (ev.target.id == "addGO"){
        
        //change the title of the modal window
        var header = document.getElementById("giftTitle");
        header.innerHTML = "Add a Gift";
              
        //show the modal
        document.getElementById("add-gift").style.display="block";
        document.querySelector("[data-role=overlay]").style.display="block";
        
         //add people from database to options list
        db.transaction(function(trans){
        
        trans.executeSql('SELECT * FROM people', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("people names found, added to list");
            
                                    
                                        var optList = document.getElementById("list-per-occ");
            
                                        //clear the list from previous and re-add the default value option
                                        optList.innerHTML = "";
                                        var dftl = document.createElement("option");
                                        dftl.setAttribute("value", 0);
                                        dftl.innerHTML = "Choose a Person";
                                        optList.appendChild(dftl);
            
                                        //update the list view
                                        var numList = rs.rows.length;
                                        for(var i=0; i<numList; i++){
                                                var newOpt = document.createElement("option");
                                                newOpt.setAttribute("value", rs.rows.item(i).person_id );
                                                newOpt.innerHTML = rs.rows.item(i).person_name;
                                                optList.appendChild(newOpt);
                                        }
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });

        });
              
    
    };
    
}

function hideModal(){
    
        //hide all modals
        document.getElementById("add-person-occasion").style.display="none";
        document.getElementById("add-gift").style.display="none";
        document.querySelector("[data-role=overlay]").style.display="none";

    
}

function swipePage(url){
     
	if(url == null){
		//home page first call
		pplList.className = 'active';
		history.replaceState(null, null, "#home");	
	}else{
        
        if (url.target.id == "people-list"){
            pplList.className = '';
            occList.className = 'active';
        }else{
            pplList.className = 'active';
            occList.className = '';
        }

    }
}

function showGifts(ev){
    
    //catch the parent element for validation
    parentCatch = ev.target.parentElement.id;
    //catch the li's id
    liCatch = ev.target.id;
    
    console.log(ev);
    
    if (parentCatch === "pplList"){
        
        document.getElementById("perSpan").innerHTML = (ev.target.innerHTML);
        
        showPersonGifts();
        
        pplList.className = '';
        occList.className = '';
        giftListO.className = '';
        giftListP.className = 'active';
        
    } else if (parentCatch == "occList"){
        
        document.getElementById("occSpan").innerHTML = (ev.target.innerHTML);
        
        showOccGifts();
        
         pplList.className = '';
        occList.className = '';
        giftListO.className = 'active';
        giftListP.className = '';
        
    };
    
    
    
    
};

function hideGifts(ev){
    
    //catch the parent element for validation
    parentCatch = ev.target.parentElement.id;
    
    if (parentCatch === "gifts-for-person"){
        
        
        pplList.className = 'active';
        occList.className = '';
        giftListO.className = '';
        giftListP.className = '';
        
    } else if (parentCatch == "gifts-for-occasion"){
        
        
         pplList.className = '';
        occList.className = 'active';
        giftListO.className = '';
        giftListP.className = '';
        
    };
    
    
    
    
    
}


/********************************************

            DATABASE FUNCTIONS
    
**********************************************/


function checkDB(){
    
    //app start once deviceready occurs
    console.info("deviceready");
    db = openDatabase('giftr1', '', 'Giftr DB', 1024*1024);
    if(db.version == ''){
        console.info('First time running... create tables'); 
        //means first time creation of DB
        //increment the version and create the tables
        db.changeVersion('', '1.0',
                function(trans){
                    //something to do in addition to incrementing the value
                    //otherwise your new version will be an empty DB
                    console.info("DB version incremented");
                    //do the initial setup               
                    trans.executeSql('CREATE TABLE people(person_id INTEGER PRIMARY KEY AUTOINCREMENT, person_name VARCHAR)', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Table people created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
                    trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name VARCHAR)', [], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.info("Table occasions created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
                    trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea VARCHAR, purchased BOOLEAN)', [], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.info("gifts occasions created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
                },
                function(err){
                    //error in changing version
                    //if the increment fails
                    console.info( err.message);
                },
                function(){
                    //successfully completed the transaction of incrementing the version number   
                    console.log("successsssss!");
                });
       // addNavHandlers();
    }else{
        //version should be 1.0
        //this won't be the first time running the app
        showPplList();
        showOccList();
        console.info('Version: ', db.version)   
        
    }
};

function showPplList(){
    
  var list = document.getElementById("pplList");
  list.innerHTML = "";
  //clear out the list before displaying everything
  db.transaction(function(trans){
    trans.executeSql("SELECT * FROM people", [], 
    	function(tx, rs){
      	//success
      	//rs.rows.item(0).name would be the contents of the first row, name column
      	//rs.rows.length is the number of rows in the recordset
      	var numPeople = rs.rows.length;
      	for(var i=0; i<numPeople; i++){
              var li = document.createElement("li");
                li.setAttribute("id", rs.rows.item(i).person_id)
              li.innerHTML = rs.rows.item(i).person_name;
              list.appendChild(li);
        }
      console.log("displayed the current contents of the people table")
    	}, 
      function(tx, err){
      	//error
      	console.log("transaction to list contents of stuff failed")
    });
  });
    
    //set the hammer listeners for this list
    var ht6 = new Hammer.Manager(list);
    ht6.add( new Hammer.Tap({ event: 'doubletap', taps:2}) );
    ht6.add( new Hammer.Tap({ event: 'singletap'}) );
    ht6.get('doubletap').recognizeWith('singletap');
    ht6.get('singletap').requireFailure('doubletap');

    //hammer listener and functino to show modal window
    ht6.on('singletap', showGifts);
    ht6.on('doubletap', removeJunction);

};

function showOccList(){
    
  var list = document.getElementById("occList");
  list.innerHTML = "";
  //clear out the list before displaying everything
  db.transaction(function(trans){
    trans.executeSql("SELECT * FROM occasions", [], 
    	function(tx, rs){
      	//success
      	//rs.rows.item(0).name would be the contents of the first row, name column
      	//rs.rows.length is the number of rows in the recordset
      	var numOccasions = rs.rows.length;
      	for(var i=0; i<numOccasions; i++){
              var li = document.createElement("li");
                li.setAttribute("id", rs.rows.item(i).occ_id)
              li.innerHTML = rs.rows.item(i).occ_name;
              list.appendChild(li);
        }
      console.log("displayed the current occassion list")
    	}, 
      function(tx, err){
      	//error
      	console.log("occasion list diplay fail")
    });
  });
    
    //set the hammer listeners for this list
    var ht6 = new Hammer.Manager(list);
    ht6.add( new Hammer.Tap({ event: 'doubletap', taps:2}) );
    ht6.add( new Hammer.Tap({ event: 'singletap'}) );
    ht6.get('doubletap').recognizeWith('singletap');
    ht6.get('singletap').requireFailure('doubletap');

    //hammer listener and functino to show modal window
    ht6.on('singletap', showGifts);
    ht6.on('doubletap', removeJunction);
    
};

function showPersonGifts(){


    var list = document.getElementById("giftListP");
    list.innerHTML = "";
    
      //clear out the list before displaying everything
      db.transaction(function(trans){
        trans.executeSql("SELECT g.gift_id, g.person_id, g.occ_id, g.gift_idea, g.purchased, o.occ_id, o.occ_name FROM gifts AS g INNER JOIN occasions AS o ON g.occ_id = o.occ_id WHERE g.person_id = (?)", [liCatch], 
            function(tx, rs){
            //success
            //rs.rows.item(0).name would be the contents of the first row, name column
            //rs.rows.length is the number of rows in the recordset
            var numGifts = rs.rows.length;
            for(var i=0; i<numGifts; i++){
                  var li = document.createElement("li");
                
                    //check for purchased
                    if (rs.rows.item(i).purchased == 'true'){
                        li.className = 'green';
                    }
                
                    li.setAttribute("id", rs.rows.item(i).gift_id)
                  li.innerHTML = rs.rows.item(i).gift_idea + "-" + rs.rows.item(i).occ_name;
                
                  list.appendChild(li);
            }
          console.log("displayed the current contents of this persons gifts table")
            }, 
          function(tx, err){
            //error
            console.log("transaction to list contents of stuff failed")
        });
      });

        //set the hammer listeners for this list
        var ht8 = new Hammer.Manager(list);
        ht8.add( new Hammer.Tap({ event: 'doubletap', taps:2}) );
        ht8.add( new Hammer.Tap({ event: 'singletap'}) );
        ht8.get('doubletap').recognizeWith('singletap');
        ht8.get('singletap').requireFailure('doubletap');

        //hammer listener and functino to show modal window
        ht8.on('singletap', addPurchased);
        ht8.on('doubletap', removeJunction);



};

function showOccGifts(){
    
    
    var list2 = document.getElementById("giftListO");
    list2.innerHTML = "";
    
      //clear out the list before displaying everything
      db.transaction(function(trans){
        trans.executeSql("SELECT g.gift_id, g.person_id, g.occ_id, g.gift_idea, g.purchased, p.person_id, p.person_name FROM gifts AS g INNER JOIN people AS p ON g.person_id = p.person_id WHERE g.occ_id = (?)", [liCatch], 
            function(tx, rs){
            //success
            //rs.rows.item(0).name would be the contents of the first row, name column
            //rs.rows.length is the number of rows in the recordset
            var numGifts = rs.rows.length;
            for(var i=0; i<numGifts; i++){
                  var li = document.createElement("li");
                
                //check for purchased
                    if (rs.rows.item(i).purchased == 'true'){
                        li.className = 'green';
                    }
                
                li.setAttribute("id", rs.rows.item(i).gift_id)
                  li.innerHTML = rs.rows.item(i).gift_idea+ "-" + rs.rows.item(i).person_name;
                  list2.appendChild(li);
            }
          console.log("displayed the current contents of this occasions Gifts table")
            }, 
          function(tx, err){
            //error
            console.log("transaction to list contents of stuff failed")
        });
      });

        //set the hammer listeners for this list
        var ht8 = new Hammer.Manager(list2);
        ht8.add( new Hammer.Tap({ event: 'doubletap', taps:2}) );
        ht8.add( new Hammer.Tap({ event: 'singletap'}) );
        ht8.get('doubletap').recognizeWith('singletap');
        ht8.get('singletap').requireFailure('doubletap');

        //hammer listener and functino to show modal window
        ht8.on('singletap', addPurchased);
        ht8.on('doubletap', removeJunction);







};

function addJunction(){
    
   
    //see what add function to start
    if (parentCatch === "people-list"){
        
        //collect the added text
        textCatch = document.getElementById("new-per-occ").value;
        
        //start the add person function
        addPerson();
    } else if (parentCatch == "occasion-list"){
        
        //collect the added text
        textCatch = document.getElementById("new-per-occ").value;
        
        //start the add occasion function
        addOccasion();
    } else if (parentCatch == "gifts-for-person"){
        
        //collect the added text
        textCatch = document.getElementById("new-idea").value;
        optCatch = document.getElementById("list-per-occ").value;
        
        
        //start the add gift function
        addGiftPerson();
    } else if (parentCatch == "gifts-for-occasion"){
        
        //collect the added text
        textCatch = document.getElementById("new-idea").value;
        optCatch = document.getElementById("list-per-occ").value;
        
        //start the add gift function
        addGiftOccasion();
    }
 

    //hide the modal
    hideModal();
};

function addPerson(){
    
    db.transaction(function(trans){
        
    trans.executeSql('INSERT INTO people(person_name) VALUES (?)', [textCatch], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Person Added");
                                        //update the list view
                                        showPplList();
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });

    });

};

function addOccasion(){
    
    db.transaction(function(trans){
        
    trans.executeSql('INSERT INTO occasions(occ_name) VALUES (?)', [textCatch], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Occasion Added");
                                        //update the list view
                                        showOccList();
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });

    });

};

function addGiftPerson(){
    
    console.log(liCatch);
    

    db.transaction(function(trans){
        
    trans.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea) VALUES (?, ?, ?)', [liCatch, optCatch, textCatch], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Gift for person Added");
                                        //reshow the list
                                        showPersonGifts();  
                                        
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });

    });


};

function addGiftOccasion(){
    
    console.log(optCatch, liCatch, textCatch);

    db.transaction(function(trans){
        
    trans.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea) VALUES (?, ?, ?)', [optCatch, liCatch, textCatch], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Gift for occasion Added");
                                        //reshow the list
                                        showOccGifts();
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });

    });

    




};

function removeJunction(ev){

    
    parentCatch = ev.target.offsetParent.id;

//see what add function to start
    if (parentCatch === "people-list"){
        
        //collect the added text
        textCatch = ev.target.id;
        
        //start the add person function
        removePerson();
    } else if (parentCatch == "occasion-list"){
        
        //collect the added text
        textCatch = ev.target.id;
        
        //start the add occasion function
        removeOccasion();
    } else if (parentCatch == "gifts-for-person"){
        
        textCatch = ev.target.id;
        //start the add occasion function
        removeGiftPpl();
    } else if (parentCatch == "gifts-for-occasion"){
        
        textCatch = ev.target.id;
        //start the add occasion function
        removeGiftOcc();
    }








};

function removePerson(){
    //remove this person
    db.transaction(function(trans){

        trans.executeSql('DELETE FROM people WHERE person_id = (?)', [textCatch], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("Person Deleted");
                                            //update people list
                                            showPplList();
                                            
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

        });

    //remove this persons gifts
    db.transaction(function(trans){

        trans.executeSql('DELETE FROM gifts WHERE person_id = (?)', [textCatch], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("Person's gifts Deleted");
                                            
                                            
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

        });

   
};

function removeOccasion(){

    //remove the occasion
    db.transaction(function(trans){

        trans.executeSql('DELETE FROM occasions WHERE occ_id = (?)', [textCatch], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("Occasion Deleted");
                                            //update list
                                            showOccList();
                                            
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

    });
    
    //remove that occasions gifts
    db.transaction(function(trans){

        trans.executeSql('DELETE FROM gifts WHERE occ_id = (?)', [textCatch], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("Occasion gifts Deleted");
                                            
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

    });

    
    
};

function removeGiftPpl(){
    
    
    db.transaction(function(trans){

        trans.executeSql('DELETE FROM gifts WHERE gift_id = (?)', [textCatch], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("gift Deleted");
                                            //update the list view
                                            showPersonGifts();
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

    });

};

function removeGiftOcc(){
    
    db.transaction(function(trans){

        trans.executeSql('DELETE FROM gifts WHERE gift_id = (?)', [textCatch], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("gift Deleted");
                                            //update the list view
                                            showOccGifts();
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

    });

    
    
    
};

function addPurchased(ev){
    
    

    if (ev.target.className == 'green'){
        
        
        ev.target.className = '';
        
        
        db.transaction(function(trans){

        trans.executeSql("UPDATE gifts SET purchased = 'false' WHERE gift_id = (?)", [ev.target.id], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("gift not purchased");
            
                                            if (ev.target.parentElement.id == "giftListO")
                                            { //show occasion gifts updated
                                                showOccGifts();
                                            }else{
                                                showPersonGifts();
                                            };
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

        });
    
    }else{
        
        ev.target.className = 'green';
        
        db.transaction(function(trans){

        trans.executeSql("UPDATE gifts SET purchased = 'true' WHERE gift_id = (?)", [ev.target.id], 
                                        function(tx, rs){
                                            //do something if it works
                                            console.info("gift purchased");
            
                                            if (ev.target.parentElement.id == "giftListO")
                                            { //show occasion gifts updated
                                                showOccGifts();
                                            }else{
                                                showPersonGifts();
                                            };
                                        },
                                        function(tx, err){
                                            //failed to run query
                                            console.info( err.message);
                                        });

        });
    };


};

