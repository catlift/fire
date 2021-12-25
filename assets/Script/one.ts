// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import playerControl from "./player"

@ccclass
export default class one extends cc.Component {
	
	@property(playerControl)
	playerControl: playerControl = null;

	@property(cc.Node)
	player: cc.Node = null;
	
	@property(cc.Node)
	enemy: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;
	
	@property
	_score: Number = 0;
	
	get score() {
		return this._score;
	}
	
	set score(value) {
		if(value <= 0) value = 0;
		this._score = value;
		this.scoreLabel.string = "score: " + this._score;
	}

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		cc.director.getPhysicsManager().enabled = true;
		
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchFire, this);
		
		this.playerRigidBody = this.player.getComponent(cc.RigidBody);
		
		this.enemyRigidBody = this.enemy.getComponent(cc.RigidBody);
		
		this.getSize = this.enemy.getContentSize();
	}

    start () {
		this.initPlayer();
		
		this.initEnemy();
    }

    update (dt) {
		if(this.playerControl.playerDeath) {
			this.initPlayer();
			this.initEnemy();
			this.score = 0;
			this.playerControl.playerDeath = false;
		}
		if(this.playerControl.enemyDeath) {
			this.initEnemy();
			this.initPlayer();
			this.score += 1;
			this.playerControl.enemyDeath = false;
		}
	}
	
	onDestroy() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchFire, this);
	}
	
	initEnemy() {
		this.enemy.active = true;
		let size = (1 - (this.score * 0.1)) * this.getSize.width;
		if(size<= 50) size = 50;
		this.enemy.setContentSize(size, size);
		
		let enemyX = cc.winSize.width / 2 - this.enemy.width/2;
		let enemyY = Math.floor(Math.random() * cc.winSize.height/4) ;
		let time = 0.6 + Math.random() * 0.5;
		
		this.enemy.setPosition(0, cc.winSize.height/2 - this.enemy.height/2);
		let move = cc.tween().to(time, {position: cc.v2(enemyX, enemyY)}).to(time, {position: cc.v2(-enemyX, enemyY)})
		cc.tween(this.enemy).then(move).repeatForever().start();
	}
	
	initPlayer() {
		this.player.setPosition(0, -cc.winSize.height / 4)
		
		this.playerRigidBody.linearVelocity = cc.v2(0, 0);
		this.playerRigidBody.gravityScale = 0.5;
		
		this.player.active = true;
	}
	
	onTouchFire() {
		this.playerRigidBody.linearVelocity = cc.v2(0, 600);
		this.playerRigidBody.gravityScale = 0;
	}
}
