// ==UserScript==
// @name         Machinery automate
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Script for automating the Machinery idle game.
// @author       kaws#9779
// @match        https://louigiverona.com/machinery/index_dev.html
// @icon         https://www.google.com/s2/favicons?domain=louigiverona.com
// @grant        none
// @downloadURL  https://github.com/kalobkalob/MachineryAutomate/raw/main/MachinerAutomate.user.js
// ==/UserScript==

class Page {
    constructor(){
        this.generators = [new Generator("one"),new Generator("two"),new Generator("three"),new Generator("four")];
        this.system = new System();
        this.battery = new Battery();
        this.magnetron = new Magnetron();
        this.engineer = new Engineer();
        setInterval(()=>this.update(),480);
    }
    update(){
        this.system.update();
        for(let i=0, len=this.generators.length; i<len; i++) this.generators[i].update();
        this.battery.update();
        this.magnetron.update();
        this.engineer.update();
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
    update(){
        if(!this.btns.main.disabled)this.btns.main.click;
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