//To Do List
/*
12. Show runs scored for top sim
1. Show sim progress so a long process will show user something is happening
2. Allow for more than 9 batters
3. Integrate SLG
4. Integreate Walk rate, Single rate, 2B rate, 3B, HR and HBP
5. Integrate player speed or propensity to try stealing
6. Smarter rules
   A. Walk doesn't score player on 2nd but single usually does
   B. Possibly Pitch by pitch simulation
7. Home team only goes 8 innings if leading
9. Don't need to permute every combo.  Only get the current needed combo
10. Find a way to have more than 12 batters.  Right now the max array size in javascript is about 4 billion.  But 13 factorial is over 6 billion.
11. Replace Line 47 with number of batters
13. Allow user to scroll through several of the top lineup combinations
14. Allow user to print the best lineup combinations in a grid
15. Hook to a database so user can save roster and stats
16. Allow user to login (maybe with Google ID) so they can retrieve their rosters later
17. Automate ability to import MLB rosters
Done
8. Don't do sequential sims combo_nums if they aren't doing the max Lineup Combinations
*/
var global_lineup = [];
var global_max_combos = 0;
var display_sims = 0;

$(document).ready(function() {
  $( "form" ).submit(function( event ) {

    var playerList = [];
    $("form .player-name").each(function(index){
      var player = {};
      player["position"] = index+1;
      player["name"] = $(this).val(); // This is the jquery object of the input, do what you will
      player["oba"] = $(".player-oba:eq(" + index + ")").val();
      playerList.push(player);
    });
    //launch(display_sims, playerList);
    start_sim(playerList);
    event.preventDefault();
  });
});
function launch(display_sims) {
   var inc = 0,
       max = 9999;
       delay = 100; // 100 milliseconds

   function timeoutLoop() {
      //document.getElementById('result').innerHTML = inc;
      $("#display_sim_count").html(inc);
      if (++inc < max)
         setTimeout(timeoutLoop, delay);
   }
   setTimeout(timeoutLoop, delay);
}
function start_sim(playerList){
  var combo_num = 0;
  var total_combos = parseInt($("#num_combos").val());
  var number_of_sims = parseInt($("#num_sims").val());
  var total_runs_scored = 0;
  var sim_result = 0;
  var currentOrder=[];
  var newList=[];
  var top_combo_num=0;
  var top_combo_runs=0;
  var desired_permutation_num;
  global_max_combos = factorial(9); //Replace with number of batters
  var combo_num_multiple=((global_max_combos/total_combos));  //If the user isn't running the max number of combos, then we use this to bring greater variety to the combinations.  Otherwise if they are running 3 combos for example they all will look similar like this [0,1,2,3,4,5,6,7,8] and [1,0,2,3,4,5,6,7,8] and [0,1,3,2,4,5,6,7,8]
  console.log("Line 49 global_max_combos="+global_max_combos+"|total_combos="+total_combos+"|combo_num_multiple="+combo_num_multiple)
  for (var combo_num = 0; combo_num < total_combos; combo_num++) {
    var total_runs_scored = 0;
    desired_permutation_num = Math.floor(combo_num * combo_num_multiple);
    newList=get_next_proposed_lineup(playerList, desired_permutation_num);
    //console.log("Line 37 newList=");
    console.log(newList);
    //console.log('first guy='+newList[0]);
    currentOrder[0]=playerList[newList[0]];
    currentOrder[1]=playerList[newList[1]];
    currentOrder[2]=playerList[newList[2]];
    currentOrder[3]=playerList[newList[3]];
    currentOrder[4]=playerList[newList[4]];
    currentOrder[5]=playerList[newList[5]];
    currentOrder[6]=playerList[newList[6]];
    currentOrder[7]=playerList[newList[7]];
    currentOrder[8]=playerList[newList[8]];
    //console.log('first guy #='+newList[0]);
    //console.log('first guy name='+currentOrder[0]["name"]);
    //console.log('whole array currentOrder='+currentOrder);
    //console.log(currentOrder);
    //console.log('whole array playerList=');
    //console.log(playerList);
    for (var i = 0; i < number_of_sims; i++) {
       //total_runs_scored += processLineup(playerList);
       total_runs_scored += processLineup(currentOrder);
       //total_runs_scored = 5;
    }
      if(total_runs_scored>top_combo_runs) {
         top_combo_runs = total_runs_scored;
         top_combo_num = desired_permutation_num;
      }
      sim_result = total_runs_scored/number_of_sims;
      console.log('desired_permutation_num='+desired_permutation_num+'|runs_result='+sim_result);

      display_sims = (combo_num+1)*number_of_sims;
      $("#display_sim_count").html(display_sims);  //Need to make this update on the screen with a setTimer
    }
    populate_best_lineup(top_combo_num, playerList);

    var mlb_adjusted_runs = ((top_combo_runs / 2.7) / number_of_sims);
    $("#display_runs_scored").html(mlb_adjusted_runs.toFixed(2));
}


function populate_best_lineup(top_combo_num, playerList) {
  var top_lineup=[];
  var currentOrder=[];
  this_lineup = fpermute([0,1,2,3,4,5,6,7,8]);
  var simLength = this_lineup.length;
  console.log('Number of sim possibilities is'+simLength);
  top_lineup = this_lineup[top_combo_num];
  currentOrder[0]=playerList[top_lineup[0]];
  currentOrder[1]=playerList[top_lineup[1]];
  currentOrder[2]=playerList[top_lineup[2]];
  currentOrder[3]=playerList[top_lineup[3]];
  currentOrder[4]=playerList[top_lineup[4]];
  currentOrder[5]=playerList[top_lineup[5]];
  currentOrder[6]=playerList[top_lineup[6]];
  currentOrder[7]=playerList[top_lineup[7]];
  currentOrder[8]=playerList[top_lineup[8]];
  var arrayLength = playerList.length;
  for (var pn = 0; pn < arrayLength; pn++) {
    $("#res_player"+pn).html(currentOrder[pn]["name"]);
    $("#res_OBA"+pn).html(currentOrder[pn]["oba"]);
  }
}

function factorial(n) {
  return (n != 1) ? n * factorial(n - 1) : 1;
}

function get_next_proposed_lineup(playerList, combo_num){
  var count = 0;
  var this_lineup = [];

  this_lineup = fpermute([0,1,2,3,4,5,6,7,8]);
  //console.log(fpermute([1, 2, 3]));
  //console.log("Line 76 this_lineup[combo_num]=");
  //console.log(this_lineup[combo_num]);
  //console.log('z There have been ' + combo_num + ' permutations');
  return this_lineup[combo_num];
}

function fpermute(array) {
	Array.prototype.swap = function (index, otherIndex) {
		var valueAtIndex = this[index]

		this[index] = this[otherIndex]
		this[otherIndex] = valueAtIndex
	}

	var result = [array.slice()]

	, length = array.length

	for (var i = 1, heap = new Array(length).fill(0)
		; i < length
	;)
		if (heap[i] < i) {
			array.swap(i, i % 2 && heap[i])
			result.push(array.slice())
			heap[i]++
			i = 1
		} else {
			heap[i] = 0
			i++
		}

	return result
}

function get_next_batter(previous_batter_num, total_batters){
  var next_batter = previous_batter_num + 1;
  if(next_batter>total_batters) {
    next_batter = 1;
  }
  return next_batter;
}

function processLineup(playerList) {
   var batter_num = 1;
   var outcome;
   var occupied_bases;
   var total_runs = 0;
   var outs = 0;
   var runs = 0;
   var total_innings = 9;
   var current_inning = 0;
   var OBA = 0;
   var cnt = 0;
   var at_bat_result = [];
   var current_state = "0";
   var total_batters = 9;

  for (var i = 0; i < total_innings; i++) {
    outs = 0;
    cnt = 0;
    while (outs < 3) {
       previous_batter_num = batter_num;
       batter_num = get_next_batter(previous_batter_num, total_batters);
       arr_num = batter_num - 1; //Arrays start at 0
       //Temp hack
       player = playerList[arr_num]["name"];
       OBA = playerList[arr_num]["oba"];
       cnt++;
       if(cnt>40) { outs = 3; }
       //end Temp hack
       //console.log("XX oba="+OBA+"|outs="+outs+"|inning="+i+"|runs="+total_runs+"cnt="+cnt);
       outcome = get_batter_outcome(player, OBA);
       at_bat_result = process_outcome(outcome, current_state, outs);
       total_runs += at_bat_result['runs_scored'];
       outs = at_bat_result['outs'];
       occupied_bases = at_bat_result['new_state'];
       current_state = occupied_bases;
     }
   }
   return total_runs;
}
function process_outcome(outcome, current_state, outs) {
  var ret = new Object();
    if(outcome=="OUT") {
      ret['new_state'] = current_state;
      ret['outs'] = outs + 1;
      ret['runs_scored'] = 0;
    }
    if(outcome=="1B") {
      if(current_state=="0") {
        ret['new_state'] = "1";
        ret['outs'] = outs;
        ret['runs_scored'] = 0;
      }
      if(current_state=="1") {
        ret['new_state'] = "12";
        ret['outs'] = outs;
        ret['runs_scored'] = 0;
      }
      if(current_state=="12") {
        ret['new_state'] = "12";
        ret['outs'] = outs;
        ret['runs_scored'] = 1;
      }
      if(current_state=="123") {
        ret['new_state'] = "12";
        ret['outs'] = outs;
        ret['runs_scored'] = 2;
      }
    }
   return ret;
}
function get_batter_outcome(player, OBA){
    var rchance = Math.floor(Math.random() * 1000);
    //console.log("rchance="+rchance+"|OBA="+OBA);
    if(rchance <= (OBA*1000)) {
      var ret = "1B";
      //console.log('HIT!!');
    } else {
      var ret = "OUT";
    }
  return ret;
}
