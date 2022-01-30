// ==UserScript==
// @name         Machinery automate
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Script for automating the Machinery idle game.
// @author       kaws#9779
// @match        https://louigiverona.com/machinery/*
// @icon         https://louigiverona.com/favicon.ico
// @grant        none
// @downloadURL  https://github.com/kalobkalob/MachineryAutomate/raw/main/MachinerAutomate.user.js
// ==/UserScript==

/* TODO
* BUGS:
* magnetron issue before unlock. Can break save. Check for others.
* Condensed update system to single loop through modifiable array.

* Possible upgrades: Use predictive method for increasing methods.
*/
var CHEAT_MODE = false;
class Page {
    constructor(){
        this.generators = [new Generator("one"),new Generator("two"),new Generator("three"),new Generator("four")];
        this.system = new System();
        this.battery = new Battery();
        this.magnetron = new Magnetron();
        this.engineer = new Engineer();
        this.toUpdate = [this.system];
        this.toAdd = [this.battery, this.magnetron, this.engineer];
        for(let i=0, len=this.generators.length; i<len; i++) this.toUpdate.push(this.generators[i]);
        let interval_base = 15;
        let interval_mult = 8;//32 to equal 480
        setInterval(()=>this.update(),interval_base*interval_mult);
    }
    update(){
        if(this.toAdd.length>0)this.addEnable();
        //this.system.update();
        for(let i=0, len=this.toUpdate.length; i<len; i++) this.toUpdate[i].update();
    }
    addEnable(){
        if(this.toAdd[0].isEnabled) this.toUpdate.push(this.toAdd.shift());
    }
}
class Engineer {
    constructor(){
        this.left = {
            lever: window.auxiliary_lever1[0],
            get effectiveness(){return window.auxiliary_effectiveness1},
            set effectiveness(value){ window.auxiliary_effectiveness1=value}
        }
        this.right = {
            lever: window.auxiliary_lever2[0],
            get effectiveness(){return window.auxiliary_effectiveness2},
            set effectiveness(value){ window.auxiliary_effectiveness2=value}
        }
        this.auxLabel = window.auxiliary_effectiveness_label[0];
    }
    setSide(target){
        if(target.lever.value!=0) target.lever.value=0;
        if(target.effectiveness!=5) target.effectiveness=5;
    }
    get isEnabled() {
        return false;
    }
    update(){
        this.setSide(this.left);
        this.setSide(this.right);
        this.auxLabel.innerText="[+"+(this.left.effectiveness+this.right.effectiveness)+"%]";
    }
}
class Magnetron {
    constructor(){
        this.btns = {
            main:window.magnetron_button[0],
            multiplier:window.magnetron_multiplier_upgrade[0],
            duration:window.magnetron_duration_upgrade[0]
        };
        this.data = {
            get multiplier(){return window.magnetron_multiplier},
            get duration(){return window.magnetron_duration}
        };
    }
    get state(){
        return this.btns.main.className.split('_')[2];
    }
    runMag(){
        window.magnetron_state=2;
        window.magnetron_buttonEnable();
    }
    get isEnabled() {
        return false;
    }
    update(){
        //console.log(this.state);
        if(window.magnetron_duration){
            switch(this.state){
                case 'disarmed':
                    if(CHEAT_MODE)this.runMag();
                    break;
                case 'armed':
                    this.btns.main.click();
                    break;
                case 'timer':
            }
        }
    }
}
class Battery {
    constructor(){
        this.btns={
            batteryUp: window.battery_percent_up[0],
            batteryDown: window.battery_percent_down[0],
            throughput: window.charge_throughput_upgrade[0],
            limit: window.charge_limit_upgrade[0]
        };
        this.data={
            get chargePercent(){return window.battery_charge_percentage},
            get chargeLimit(){return window.battery_charge_percentage_limit},
            get indicatorLimit(){return window.charge},
            get indicatorCurrent(){return window.charge_limit}
        };
    }
    get isEnabled() {
        //battery_charge_percentage!=0, battery_state!=0, window.battery_lock_block[0].style.display=='none'
        return window.battery_lock_block[0].style.display=='none';
    }
    update(){
        if(this.data.indicatorCurrent==this.data.indicatorLimit)this.btns.limit.click();
    }
}
class System {
    constructor(){
        this.moneyLimitBtn = window.money_limit_upgrade[0];
        this.upgradeBoxes = [...window.bonusbox];
    }
    get money() {return window.money}
    get moneyLimit() {return window.money_limit}
    update(){
        //this.money = window.money;
        //this.moneyLimit = window.money;
        if(this.money == this.moneyLimit) this.moneyLimitBtn.click();
        if(!this.upgradeBoxes[0].disabled) this.upgradeBoxes[0].click();
    }
}
class Generator {
    constructor(num){
        this.num=num;
        /*this.funcs={
            supply:()=>{
                window[this.num+"_supply"]=window[this.num+"_price"];
                window[this.num+"_supply_label"].text(window.numT(window[this.num+"_supply"]));
                window[this.num[0].toUpperCase() + this.num.slice(1)]();
            }
        }*/
        this.btns={
            supply:window["button_"+num][0],
            limit:window[num+"_upgrade_supply_limit"][0],
            power:window[num+"_upgrade_effectiveness"][0],
            generation:window[num+"_upgrade_generation"][0]
        };
        this.btns.num=num;

        this.data = {
            get supply(){return window[this.num+"_supply"]},
            get supplyLimit(){return window[this.num+"_price"]}
        };
        this.data.num=num;

    }
    update(){
        if(this.data.supplyLimit>0&&this.data.supply==0)this.btns.supply.click();
        //if(this.data.supplyLimit>0&&this.data.supply==0)this.funcs.supply();
    }
}
var page = new Page();