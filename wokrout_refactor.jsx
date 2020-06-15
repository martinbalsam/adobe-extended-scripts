﻿main()function main(){proj = app.project;app.enableQE();var csvFile = File.openDialog ("Target CSV File","*.csv"); // PROMPT FOR CSV FILEvar csvFile = csvFile.fsName; // FORMAT CSV FILEPATH TO BE FRIENDLYvar infoArray; //array containg all the infos in the csv file  // Following opens the text file and stores it in var CSVFILE. Then splits it by every new line, and COMA into a multi-tiered array, INFOARRAY.if(csvFile){        var file = File(csvFile) //OPEN, READ, AND CLOSE THE CSV FILE    file.open("r");    var fullText = file.read();    file.close();    infoArray = fullText.split("\n"); // SPLIT THE CSV FILE AT EVERY NEW LINE            for(var a=0;a<infoArray.length;a++){ // LOOP THROUGH EACH LINE, SPLIT THE LINE AT EVERY COMMA            infoArray[a] = infoArray[a].split(",");              }}if(infoArray[infoArray.length -1] == ""){ //SOMETIMES WHEN SPLITTING UP THE ARRAY, THE PROCESS CREATES AN EXTRA, EMPTY LINE. tHIS WILL JUST TEST AND REMOVE THAT IF IT HAPPENS    infoArray.splice(infoArray.length-1, 1);    }var nameArray = [];binLog = "";//DEFINE THE EXERCISE BINvar  exercisesBin = findBinIndex(proj.rootItem, "05_EXERCISES_edited");if (!exercisesBin) {    binLog +="no 05_EXERCISES_edited Bin!\n";    }//DEFINE THE EXERCISE INTROS (PREROLL) BIN --- BLURREDvar  exercisesIntrosBin = findBinIndex(proj.rootItem, "05_EXERCISES-BLURRED");if (!exercisesIntrosBin) {    binLog +="no 05_EXERCISES-BLURRED Bin!\n";    }//DEFINE THE BREAK CLIPvar  breakBin = findBinIndex(proj.rootItem, "BREAK");if (!breakBin) {    binLog +="no BREAK Bin!\n";    }//DEFINE THE BREAK CLIPvar  breakTimersBin = findBinIndex(proj.rootItem, "titles_TIMERS");if (!breakTimersBin) {    binLog +="no titles_TIMERS Bin!\n";    }//DEFINE THE NEXT CLIPvar  nextBin = findBinIndex(proj.rootItem, "NEXT");if (!nextBin) {    binLog +="no NEXT Bin!\n";    }//DEFINE THE AUDIO TIMER CLIPvar  audioTimerBin1 = findBinIndex(proj.rootItem, "AUDIO TIMER1");if (!audioTimerBin1) {    binLog +="no AUDIO TIMER Bin1!\n";    }var  audioTimerBin2 = findBinIndex(proj.rootItem, "AUDIO TIMER2");if (!audioTimerBin2) {    binLog +="no AUDIO TIMER Bin2!\n";    }//DEFINE BREAK TITLEvar  breakTitleBin = findBinIndex(proj.rootItem, "Titles_BREAK");if (!breakTitleBin) {    binLog +="no Titles_BREAK Bin!\n";    }//DEFINE THE EXERCISE TITLE BINvar  exercisesTitlesBin = findBinIndex(proj.rootItem, "Titles_EXERCISES");if (!exercisesTitlesBin) {    binLog +="no Titles_EXERCISES Bin!\n";    }var  timerExercisesBin = findBinIndex(proj.rootItem, "Titles_TIME");if (!timerExercisesBin) {    binLog +="no Titles_TIME Bin!\n";    }//check for error in loading the bins and if some of the bins are not found we exit the main() functionif (binLog.length > 0){    alert(binLog);    return;    }//define clips from the above defined binsvar breakClip = breakBin.children[0]; //only clip in Break Binvar nextClip = nextBin.children[0]; //only clip in next Binvar audioTimerClip1 = audioTimerBin1.children[0]; //only clip in next Binvar audioTimerClip2 = audioTimerBin2.children[0]; //only clip in next Binvar breakTitleClip = breakTitleBin.children[0]; //only clip in Break Binapp.project.createNewSequence(infoArray[0][0], ""); // PROMPT TO CREATE A NEW SEQUENCEvar activeSeq = proj.activeSequence;var activeSeqQA = qe.project.getActiveSequence();activeSeqQA.addTracks(1);activeSeqQA.addTracks(1);activeSeqQA.addTracks(1);activeSeqQA.addTracks(1);activeSeqQA.addTracks(1);activeSeqQA.addTracks(1);activeSeqQA.addTracks(1);var preRoll = 5; //length of preroll video in secondsvar previewPrerollTime = 1;var previewScale = 39;var previewXVal = 0.8046875;var previewYVal = 0.7194444;//~ //DEBUG START//~ for (var k=0; k< timerExercisesBin.children.numItems; k++){//~ $.writeln(timerExercisesBin.children[k].name.toString());//~ }//~ //DEBUG ENDvar T = 0;var frame = 1/24;var trans = 0.3;//MAIN LOOP over the workout csv exercises listfor (var j=1; j< infoArray.length; j++){  //loop over the whole exercise script    //SETUP the regex for searching the right exercises titles and clips    var reString = "^" + infoArray[j][0];    var reEx = new RegExp(reString);    var timeReString = "^" + infoArray[j][1];    var timeReEx = new RegExp(timeReString);        //find EXERCISE CLIP    for (var i = 0; i < exercisesBin.children.numItems; i++){        if (exercisesBin.children[i].name.toString().match(reEx)) {            var clip = exercisesBin.children[i];            }        }        //find blurred intro EXERCISE CLIP    for (var k =0 ; k< exercisesIntrosBin.children.numItems; k++){          if (exercisesIntrosBin.children[k].name.toString().match(reEx)){                var preClip = exercisesIntrosBin.children[k];                }            }    //find blurred intro EXERCISE CLIP        for (var k =0 ; k< exercisesTitlesBin.children.numItems; k++){           if (exercisesTitlesBin.children[k].name.toString().match(reEx)){               var titleClip = exercisesTitlesBin.children[k];               }           }        //find time title        for (var k = 0;  k< timerExercisesBin.children.numItems; k++){        if (timerExercisesBin.children[k].name.toString().match(timeReEx)){            var timeClip = timerExercisesBin.children[k];            }        }    //find break timer      var breakTimeReString = "^" + infoArray[j][2];     var breakTimeReEx = new RegExp(breakTimeReString);                          for (var k = 0;  k< breakTimersBin.children.numItems; k++){               if (breakTimersBin.children[k].name.toString().match(breakTimeReEx)){                   var breakTimerClip = breakTimersBin.children[k];                   }               }            //initialize local time variables for the audio inster times    var audioExerciseEndTime = 0;    var audioBreakEndTime = 0;    // video creation          //INITIALIZE A TIME VARIABLE FOR THE PREVIEW CLIP    if(j>0 && Number(infoArray[j-1][2])>0 ) {// check if it's not the first exercise loop AND if the previous break was not zero)        var insertTime = activeSeq.videoTracks[2].clips[activeSeq.videoTracks[2].clips.numItems - 1].start.seconds + previewPrerollTime;        var previewLength = Number(infoArray[j-1][2])-previewPrerollTime + 1;        var previewClip = clip;        previewClip.setOutPoint(previewLength);        activeSeq.videoTracks[7].insertClip(previewClip,insertTime);                //set the size        var numPreviewClips = activeSeq.videoTracks[7].clips.numItems;        var prevClipEffects = proj.activeSequence.videoTracks[7].clips[numPreviewClips-1].components;        prevClipEffects[1].properties[0].setValue([ previewXVal, previewYVal],true);        prevClipEffects[1].properties[1].setValue(previewScale,true);                //TRANSITION           //setFadeInOut(activeSeq.videoTracks[7].clips[activeSeq.videoTracks[7].clips.numItems-1],0.5,0,previewLength);                        //add the NEXT title        nextClip.setOutPoint(previewLength);        activeSeq.videoTracks[8].insertClip(nextClip,insertTime);                        //od transitions//~         var numTitlePreviewClips = activeSeq.videoTracks[8].clips.numItems;//~         var prevTitleClipEffects = proj.activeSequence.videoTracks[8].clips[numTitlePreviewClips-1].components;//~         prevTitleClipEffects[1].properties[0].setValue([ 0.5, 0.5],true);//~         prevTitleClipEffects[1].properties[1].setValue(100,true);        //~         //~         //~         setFadeInOut(activeSeq.videoTracks[8].clips[activeSeq.videoTracks[8].clips.numItems-1],0.5,0,previewLength);                }    //PREROLL blurred    preClip.setOutPoint(preRoll+3*trans);// add the handle for the transition    activeSeq.videoTracks[1].insertClip(preClip,T-2*trans);        titleClip.setOutPoint(preRoll);    activeSeq.videoTracks[3].insertClip(titleClip,T);        timeClip.setOutPoint(preRoll);    activeSeq.videoTracks[4].insertClip(timeClip,T);       var endTime = activeSeq.videoTracks[1].clips[activeSeq.videoTracks[1].clips.numItems - 1].end.seconds   T=endTime;    timerTime2 = T;    //EXERCISE    var inPoint = 0;    var outPoint = Number(infoArray[j][1]);    clip.setInPoint(inPoint);    clip.setOutPoint(outPoint+2*trans);// add enough handle for the transition    activeSeq.videoTracks[0].insertClip(clip,T-trans);    var endTime = activeSeq.videoTracks[0].clips[activeSeq.videoTracks[0].clips.numItems - 1].end.seconds - 2*trans // the -2*trans take into account the handle for the transition    T=endTime;    audioExerciseEndTime = T; //timer at the end of the exercise    timerTime1 = T;       //BREAK    if(Number(infoArray[j][2])>0 && j< infoArray.length-1){ //check if the break is set to 0 or if it's the last exercise        breakClip.setInPoint(0);        breakClip.setOutPoint(Number(infoArray[j][2])+1); // the +1 is to take into account the 0th second        activeSeq.videoTracks[2].insertClip(breakClip,T);        //break timer        breakTimerClip.setOutPoint(Number(infoArray[j][2])+1); // not necessary, but just in case        activeSeq.videoTracks[5].insertClip(breakTimerClip,T);        //setFadeInOut(activeSeq.videoTracks[5].clips[activeSeq.videoTracks[5].clips.numItems-1],0.5);           //break title        breakTitleClip.setOutPoint(Number(infoArray[j][2])+1)        activeSeq.videoTracks[6].insertClip(breakTitleClip,T);        //setFadeInOut(activeSeq.videoTracks[6].clips[activeSeq.videoTracks[6].clips.numItems-1],0.5);           var endTime = activeSeq.videoTracks[2].clips[activeSeq.videoTracks[2].clips.numItems - 1].end.seconds        T=endTime;               audioBreakEndTime = T;        }//end BREAK if-loop    //AUDIO        activeSeq.audioTracks[4].insertClip(audioTimerClip1,timerTime1-3.8);    activeSeq.audioTracks[4].insertClip(audioTimerClip2,timerTime2-3.2+frame*4);                 }//apply transitions all clips on tracks 1-8for(var k =1;k<9;k++){    var trackItems = getTrackClips(activeSeq.videoTracks[k]);    for(var i = 0; i < trackItems.length; i++) {        if(k==1 && i==0){continue;                                    } // don't apply transitions to the first clip on track one          var clipLength = trackItems[i].outPoint.seconds - trackItems[i].inPoint.seconds;        // get effect objects of the current image        var components = trackItems[i].components;        // [motionObj, opacityObj]        var videoComponentObjs = getComponentObjs(components);            // adjust opacity (add keys too)        var opacityParam = videoComponentObjs[1].opacity;        fadeOpacity(opacityParam, trans, trackItems[i], clipLength);    }    }}//~ var trackItems = getTrackClips(activeSeq.audioTracks[0]);//~ //remove all audio tracks//~ for(i=0;i<trackItems.lenght;i++){//~     trackItems[i].remove();//~     }//~ activeSeq.audioTracks[0]// FUNCTION LIST function setFadeInOut(clip, length,inPoint,outPoint){  //~      var inPoint = clip.inPoint.seconds;//~      var outPoint = clip.outPoint.seconds;     if(outPoint - inPoint>length*2){         var opacity = clip.components[0].properties[0];         opacity.setTimeVarying(false);         opacity.setTimeVarying(true);         prevClipEffects[0].properties[0].addKey(inPoint);         prevClipEffects[0].properties[0].addKey(inPoint+length);         prevClipEffects[0].properties[0].addKey(outPoint-length);         prevClipEffects[0].properties[0].addKey(outPoint);         prevClipEffects[0].properties[0].setValueAtKey(inPoint,0);         prevClipEffects[0].properties[0].setValueAtKey(inPoint+length,100);         prevClipEffects[0].properties[0].setValueAtKey(outPoint-length,100);         prevClipEffects[0].properties[0].setValueAtKey(outPoint,0);         }     else{         return null;         }     }  function setFadeOut(clip, length,outPoint){  //~      var inPoint = clip.inPoint.seconds;//~      var outPoint = clip.outPoint.seconds;     if(outPoint - inPoint>length*2){         var opacity = clip.components[0].properties[0];         opacity.setTimeVarying(false);         opacity.setTimeVarying(true);         prevClipEffects[0].properties[0].addKey(outPoint-length);         prevClipEffects[0].properties[0].addKey(outPoint);         prevClipEffects[0].properties[0].setValueAtKey(outPoint-length,100);         prevClipEffects[0].properties[0].setValueAtKey(outPoint,0);         }     else{         return null;         }     }   function fadeOpacity(param, length, image, seconds) {    // allow keyframes    param.setTimeVarying(true);    // add keyframes at beginning and end of the image layer (for opacity)    param.addKey(image.inPoint.seconds);    param.addKey(image.inPoint.seconds+length);    param.addKey(image.inPoint.seconds+seconds-length);    param.addKey(image.inPoint.seconds+seconds);        // change the keyframes to be 0 and 100    param.setValueAtKey(image.inPoint.seconds, 0);    param.setValueAtKey(image.inPoint.seconds+length, 100);    param.setValueAtKey(image.inPoint.seconds+seconds-length, 100);    param.setValueAtKey(image.inPoint.seconds+seconds, 0);    } function fadeOpacityOut(param, length, image, seconds) {    // allow keyframes    param.setTimeVarying(true);    // add keyframes at beginning and end of the image layer (for opacity)    param.addKey(image.inPoint.seconds+seconds-length);    param.addKey(image.inPoint.seconds+seconds);        // change the keyframes to be 0 and 100    param.setValueAtKey(image.inPoint.seconds+seconds-length, 100);    param.setValueAtKey(image.inPoint.seconds+seconds, 0);    }function getComponentObjs(components) {    var opacityComponent;    var motionComponent;    // search for the opacity and motion components for this given image    var motionObj = {                };        for(var i = 0; i < components.numItems; i++) {    if(components[i].displayName == "Opacity") {            opacityComponent = components[i];        }    if(components[i].displayName == "Motion") {            motionComponent = components[i];        }    }    var opacityObj = {        opacity: opacityComponent.properties[0]        };    // once the opacity and motion components are found, we need to get the other values (like position, scale, rotation, etc.)    for(var e = 0; e < motionComponent.properties.numItems; e++) {        switch(motionComponent.properties[e].displayName) {                case "Position":                    motionObj.position = motionComponent.properties[e];                break;                case "Scale":                    motionObj.scale = motionComponent.properties[e];                break;                case "Scale Width":                    motionObj.scaleWidth = motionComponent.properties[e];                    motionObj.scaleCheck = motionComponent.properties[e+1];                break;                case "Rotation":                    motionObj.rotation = motionComponent.properties[e];                break;                case "Anchor Point":                    motionObj.anchorPoint = motionComponent.properties[e];                break;            }        }            motionObj.scaleCheck.setValue(true, true);    // send back a proprietary object that only we know the hierarchy of    return [motionObj, opacityObj];    }function getTrackClips(videoTrack) {        var clips = [];        // get all the clips from the current track        for(var i = 0; i < videoTrack.clips.numItems; i++) {            clips.push(videoTrack.clips[i]);            }                return clips;    }function findBinIndex(currentItem, nameToFind){       if(nameToFind){    for (var j = 0; j < currentItem.children.numItems; j++){          var currentChild = currentItem.children[j];                              if (currentChild.type == ProjectItemType.BIN && currentChild.name.toUpperCase() == nameToFind.toUpperCase() ){                        globalBind = currentChild;                        return currentChild;                    }                             if (currentChild.type == ProjectItemType.BIN){                          findBinIndex(currentChild, nameToFind);                      }           }    }}