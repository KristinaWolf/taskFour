"use strict";

const readlineSync = require('readline-sync');

const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0     // ходов на восстановление
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2
        },
    ]
};

const player = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4
        },
    ]
};

let cooldownMonster = Array(monster.moves.length).fill(0),
    cooldownPlayer = Array(player.moves.length).fill(0);

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getStepMonster() {
    let stepMonster;
    do {
        stepMonster = getRandom(0, cooldownMonster.length);     
    } while (cooldownMonster[stepMonster] != 0);
    
    console.log(`\n\nДействие Лютого: ${monster.moves[stepMonster].name}`);
    cooldownMonster[stepMonster]++;

    //Подсчёт cooldown монстра
    for (let i in cooldownMonster) {
        if(cooldownMonster[i] >= monster.moves[i].cooldown) {
            cooldownMonster[i] = 0;
        } else if(cooldownMonster[i] > 0 && stepMonster != i) cooldownMonster[i]++;
    }
    return stepMonster;
}

function getStepPlayer() {
    let stepPlayer;
    console.log('\nВыберите действие:');

    for (let i in player.moves) {
        let n = '';
        if(cooldownPlayer[i] != 0) n = ` (Использовать повторно можно через шага: ${player.moves[i].cooldown-cooldownPlayer[i] + 1})`;
        console.log(`${(parseInt(i) + 1)}) ${player.moves[i].name}${n};`);
    }
    do {
        stepPlayer = parseInt(readlineSync.question('--> '))-1;

        if(cooldownPlayer[stepPlayer] != 0) console.log(`\nНельзя выбрать это действие.\nИспользовать можно шагов через: ${player.moves[stepPlayer].cooldown-cooldownPlayer[stepPlayer] + 1}`);
    } while (cooldownPlayer[stepPlayer] != 0);

    cooldownPlayer[stepPlayer]++;

    //Подсчёт cooldown героя
    for (let i in cooldownPlayer) {
        if(cooldownPlayer[i] >= player.moves[i].cooldown) {
            cooldownPlayer[i] = 0;
        } else if(cooldownPlayer[i] > 0 && stepPlayer != i) cooldownPlayer[i]++;
    }
    return stepPlayer;
}

function createDifficulty() {
    let num;
    do {
        console.log(`\nНачальное здоровье равно ${player.maxHealth}. Хотите изменить?\n1. Да\n2. Нет`);
        num = readlineSync.question('--> ');

        if (num === '1') {
            console.log('\n\nВведите начальное здоровье');            
            monster.maxHealth = player.maxHealth = readlineSync.question('--> ');
        }
    } while(num != '2' && num != '1');
}

function play() {

    createDifficulty();

    while (monster.maxHealth > 0 && player.maxHealth > 0) {
    let stepMonster = getStepMonster(),
        stepPlayer = getStepPlayer();

        getResult(stepMonster, stepPlayer);
    }

    if (monster.maxHealth < player.maxHealth) {
        console.log('\n\nТы выиграл!');
    } else {
        console.log('\n\nТы проиграл.');
    }
}

function getResult(stepMonster, stepPlayer) {
    let monsterPhysicalDmg = monster.moves[stepMonster].physicalDmg,
        monsterMagicDmg = monster.moves[stepMonster].magicDmg,
        monsterMagicArmorPercents = monster.moves[stepMonster].magicArmorPercents,
        monsterPhysicArmorPercents = monster.moves[stepMonster].physicArmorPercents,            
        playerPhysicalDmg = player.moves[stepPlayer].physicalDmg,
        playerMagicDmg = player.moves[stepPlayer].magicDmg,
        playerPhysicArmorPercents = player.moves[stepPlayer].physicArmorPercents,
        playerMagicArmorPercents = player.moves[stepPlayer].magicArmorPercents;
        
    player.maxHealth = player.maxHealth - (monsterPhysicalDmg - (playerPhysicArmorPercents / 100 * monsterPhysicalDmg )) - (monsterMagicDmg - (playerMagicArmorPercents / 100 * monsterMagicDmg));
    monster.maxHealth = monster.maxHealth - (playerPhysicalDmg - (monsterPhysicArmorPercents / 100 * playerPhysicalDmg)) - (playerMagicDmg - (monsterMagicArmorPercents / 100 * playerMagicDmg));
   
    let playerHealth = (player.maxHealth.toFixed(1) > 0) ?  player.maxHealth.toFixed(1) : 0;
    let monsterHealth = (monster.maxHealth.toFixed(1) > 0) ?  monster.maxHealth.toFixed(1) : 0;
    console.log('\nЗдоровье Евстафия: ' + playerHealth);
    console.log('Здоровье Лютого: ' + monsterHealth);
}

play();