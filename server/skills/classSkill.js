var east = 0;
var south = 1;
var west = 2;
var north = 3;
bullet = require('../skills/bullet').sendBullet;

classCoolDown = function (p, s) {
  if (s == 0) return;
  setTimeout(function(){
  	s--;
    p.classSkillCoolDown = s;
    classCoolDown(p, s);
  }, 1000)
}

rush = function (player, num) {
  if (num == 0 || player.isDead()) return;
  var face = player.face;
  var position = player.position;
  var map = player.map;
  switch (face) {
    case east:
      player.move(0, 1);
      break;
    case west:
      player.move(0, -1);
      break;
    case north:
      player.move(1, 0);
      break;
    case south:
      player.move(-1, 0);
      break;
  }

  points = [[position[0],position[1]], [position[0]-1,position[1]], [position[0]-1,position[1]-1],
           [position[0]-1,position[1]+1], [position[0],position[1]-1], [position[0],position[1]+1],
           [position[0]+1,position[1]], [position[0]+1,position[1]+1], [position[0]+1,position[1]-1]];
  map.action(player, 'attack', points, {type: 'swardAttack'});
  setTimeout(function(){rush(player, num-1)}, 100)
}

module.exports = {
	fireBall: {
    	name: 'Fireball',
    	sid: 6,
    	description: 'fire a big fireball',
   	 	cd: 15,
		  use: function(player) {
        if (player.classSkillCoolDown == 0){
          player.classSkillCoolDown = this.cd;
          map = player.map;
          point = player.position;
          face = player.face;
          var options = {
            factor: 0.8,
            range: 7,
            speed: 2,
            radius: 2,
            num: 3,
            position: [point[0], point[1]],
            type: 'fireAttack'
          }
          switch (face) {
            case east:
              bullet(map, player, options, (point)=>{point[1]++; return point;})
              break;
            case west:
              bullet(map, player, options, (point)=>{point[1]--; return point;})
              break;
            case north:
              bullet(map, player, options, (point)=>{point[0]--; return point;})
              break;
            case south:
              bullet(map, player, options, (point)=>{point[0]++; return point;})
              break;
          }
          classCoolDown(player, this.cd);
        }
  		}
    },
    arrowRain: {
      name: 'Arrowrain',
      sid: 7,
      description: 'rain of arrow, attack surrounding enemyies 2 times',
      cd: 15,
      use: function(player) {
        if (player.classSkillCoolDown == 0){
          player.classSkillCoolDown = this.cd;
          map = player.map;
          point = player.position;
          face = player.face;
          var options = {
            factor: 0.8,
            range: 3,
            speed: 2,
            radius: 4,
            num: 2,
            position: [point[0], point[1]],
            type: 'arrowAttack'
          }
          bullet(map, player, options, (point)=>{return point;})
          classCoolDown(player, this.cd);
        }
      }
    },
    rushing: {
      name: 'Rushing',
      sid: 8,
      description: 'rush forward 5 times',
      cd: 15,
      use: function(player) {
        if (player.classSkillCoolDown == 0){
          player.classSkillCoolDown = this.cd;
          rush(player, 5);
          classCoolDown(player, this.cd);
        }
      }
    }
}