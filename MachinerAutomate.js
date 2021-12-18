// ==UserScript==
// @name         Machinery automate
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Script for automating the Machinery idle game.
// @author       kaws#9779
// @match        https://louigiverona.com/machinery/index_dev.html
// @icon         https://www.google.com/s2/favicons?domain=louigiverona.com
// @grant        none
// ==/UserScript==

class Page {
    constructor(){
        this.generators = [new Generator("one"),new Generator("two"),new Generator("three"),new Generator("four")];
        this.system = new System();
        this.machine = new Machine();
        setInterval(()=>this.update(),100);
    }
    update(){
        this.system.update();
        for(let i=0, len=this.generators.length; i<len; i++) this.generators[i].update();
    }
}
class Machine {
    constructor(){
        this.btns={
            batteryUp: document.getElementById("battery_percent_up"),
            batteryDown: document.getElementById("battery_percent_down"),
            throughput: document.getElementById("charge_throughput_upgrade"),
            limit: document.getElementById("charge_limit_upgrade")
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
        this.moneyLimitBtn=document.getElementById("money_limit_upgrade");
        this.upgradeBoxes = [...document.getElementById("bonusboxblock_1").parentNode.children];
    }
    update(){
        this.money = window.money;
        this.moneyLimit = window.money;
        if(this.money == this.moneyLimit) this.moneyLimitBtn.click();
        if(!this.upgradeBoxes[0].disabled) this.upgradeBoxes[0].click();
    }
}
class Generator {
    constructor(num){
        this.num=num;
        this.btns={
            supply:document.getElementById("button_"+num),
            limit:document.getElementById(num+"_upgrade_supply_limit"),
            power:document.getElementById(num+"_upgrade_effectiveness"),
            generation:document.getElementById(num+"_upgrade_generation")
        };

        this.data = {
            get supply(){return window[this.num+"_supply"]},
            get supplyLimit(){return window[this.num+"_price"]}
        };
        this.data.num=num;
    }
    update(){
        if(this.data.supplyLimit>0&&this.data.supply==0)this.btns.supply.click();
    }
}
var page = new Page();