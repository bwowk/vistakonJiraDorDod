// ==UserScript==
// @name         Vistakon Jira DoD/DoR Agile Board
// @namespace    https://jiracloud.cit.com.br
// @version      0.6
// @description  Jira Agile board improvements
// @author       bwowk
// @require      https://raw.githubusercontent.com/bwowk/vistakonJiraDorDod/master/DorsDods.js
// @match        https://jiracloud.cit.com.br/secure/RapidBoard.jspa?rapidView=27878*
// @grant        none
// ==/UserScript==

checkExist = setInterval(function() {
    if (AJS.$('.ghx-issue').length) {
        replaceWorkflowTransition();
        postRenderOverrides();
        replaceRenderUI();
        clearInterval(checkExist);
    }
}, 100); // check every 100ms

function postRenderOverrides() {
    //Gandalf
    $("span.ghx-type[title='Incident'] img").attr('src','http://emojis.slackmojis.com/emojis/images/1481054971/1409/partywizard.gif?1481054971');
}

function replaceRenderUI() {
    oldRenderUI = GH.WorkController.renderUI;
    GH.WorkController.renderUI = function() {
        oldRenderUI();
        postRenderOverrides();
    };
}

function replaceWorkflowTransition() {
    oldWorkflowTransition = GH.WorkDragAndDrop.executeWorkflowTransition;
    GH.WorkDragAndDrop.executeWorkflowTransition = function(a,b,destinationStatus){
        switch(destinationStatus) {
//            case 10020: //-> Analysing
//                if(confirm('fez isso tudo?\nDoD:\n1.bla\n2.bla\n3.bla')) {
//                    oldWorkflowTransition(a,b,destinationStatus);
//                }
//                break;
            case 3: //-> In Progress
                if(confirmDod(dodAnalysing)) {
                    oldWorkflowTransition(a,b,destinationStatus);
                }
                break;
            case 10015: //-> Code Review
                if(confirmDod(dodInProgress)) {
                    oldWorkflowTransition(a,b,destinationStatus);
                }
                break;
            case 10027: //-> Test
                if(confirmDod(dodCodeReview)) {
                    oldWorkflowTransition(a,b,destinationStatus);
                }
                break;
            case 10042: //-> MTS
                if(confirmDod(dodTest)) {
                    oldWorkflowTransition(a,b,destinationStatus);
                }
                break;
            case 10032: //-> UAT
                if(confirmDod(dodMts)) {
                    oldWorkflowTransition(a,b,destinationStatus);
                }
                break;
//            case 10043: //-> MTP
//               if() {
//                    oldWorkflowTransition(a,b,destinationStatus);
//                }
//                break;
            case 5: //-> Resolve
                if(confirmDod(dodMtp)) {
                    oldWorkflowTransition(a,b,destinationStatus);
                }
                break;
            default:
                console.log(destinationStatus);
                if(confirm('não mapeado. quer continuar?')) {
                    oldWorkflowTransition(a,b,destinationStatus);
                };
        }
    };
    console.log('Vistakon Jira Board Improvements enabled');
}
