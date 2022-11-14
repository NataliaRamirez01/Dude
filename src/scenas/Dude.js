import Phaser from "phaser";
class Dude extends Phaser.Scene
{
    platforms = null;
    player= null;
    cursors = null;
    stars = null;
    score = 0;
    scoreText =null;
    bombs =null;
     collectStar(player, star)
{
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    star.disableBody(true, true);
    if (this.stars.countActive(true) === 0)
    {
        this.stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        console.log(this.bombs.lenght)
    }
}
hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
    preload ()
{
    this.load.image('sky', '../img/fondo.png');
    this.load.image('ground', '../img/platform.png');
    this.load.image('star', '../img/star.png');
    this.load.image('bomb', '../img/bomb.png');
    this.load.spritesheet('dude', 
        '../img/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}
   

 create ()
    {
        //Se sobreponen en el orden que se le declaran.Siempre poner primero al fondo....
        this.add.image(400, 300, 'sky');
        this.score =0;
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        //Estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 9, y: 0, stepX: 70 }
        });
        
        
        this.cursors = this.input.keyboard.createCursorKeys();
    
    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');
    this.player = this.physics.add.sprite(100,150,'dude');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);
    
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    //Para las animaciones
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

}
    update()
    {
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-200);
        
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(200);
        
            this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);
        
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-330);
        }
    }
}
export default Dude;