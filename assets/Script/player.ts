// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {
	@property(cc.Node)
	particleNode: cc.Node = null;
	
	@property(cc.ParticleSystem)
	particle: cc.ParticleSystem = null;
	
	@property
	playerDeath: boolean = false;
	
	@property
	enemyDeath: boolean = false;
	
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		
	}

    start () {
		
    }
	
	onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
		if(otherCollider.node.group == "trap") {
			let pos = selfCollider.node.getPosition();
			this.particleNode.setPosition(pos);
			this.particle.resetSystem();
			selfCollider.node.active = false;
			this.playerDeath = true;
		}else if(otherCollider.node.group == "enemy") {
			let pos = otherCollider.node.getPosition();
			this.particleNode.setPosition(pos);
			this.particle.resetSystem(); 
			selfCollider.node.active = false;
			otherCollider.node.active = false;
			this.enemyDeath = true;
		}
	}
}
