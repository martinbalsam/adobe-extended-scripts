﻿var proj = app.project;//alert(proj.name);//proj.rootItem.createBin("Giulio");function findBinIndex(currentItem, nameToFind){    if (nameToFind) {        for(var j = 0;j<currentItem.children.numItems; j++){            var currentChild = currentItem.children[j];                        if (currentChild.type == ProjectItemType.BIN && currentChild.name.toUpperCase() == nameToFind.toUpperCase()) {                globalBind = currentChild;                return currentChild;                }                        if (currentChild.type == ProjectItemType.BIN) {                findBinIndex(currentChild, nameToFind);                }            }        } else {            alert("no bin was targeted");            }        } var globalBind = null;var findMe = prompt("what bin would you like to find?", "Insert Bin Name");findBinIndex(proj.rootItem, findMe);if (globalBind != null) {    var targetBin = globalBind;        for(var i = 0 ; i < targetBin.children.numItems; i++){        targetBin.children[i].name = targetBin.children[i].name + "  #" + i;        }    } else {        alert("no bin found");        }