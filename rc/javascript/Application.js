/**
 * Set camera
 */
setCamera()
{
    this.camera = new Camera({
        time: this.time,
        sizes: this.sizes,
        renderer: this.renderer,
        debug: this.debug,
        config: this.config
        // Burada physics parametresi yok, ama World oluşturulmadan önce kamera oluşturuluyor
        // Physics World içinde oluşturulduğu için burada gönderilemiyor
    })

    this.scene.add(this.camera.container)

    this.time.on('tick', () =>
    {
        if(this.world && this.world.car)
        {
            this.camera.target.x = this.world.car.chassis.object.position.x
            this.camera.target.y = this.world.car.chassis.object.position.y
            
            // Physics'e referansı daha sonra atayalım
            if(this.world.physics && !this.camera.physics) {
                this.camera.physics = this.world.physics;
            }
        }
    })
} 