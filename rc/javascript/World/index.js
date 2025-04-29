setCar()
{
    this.car = new Car({
        time: this.time,
        resources: this.resources,
        objects: this.objects,
        physics: this.physics,
        shadows: this.shadows,
        materials: this.materials,
        controls: this.controls,
        sounds: this.sounds,
        renderer: this.renderer,
        camera: this.camera,
        debug: this.debugFolder,
        config: this.config
    })
    this.container.add(this.car.container)
    
    // Kameraya araba referansını gönder
    this.camera.setCar(this.car)
    console.log('World: Araba oluşturuldu ve kamera ile bağlandı');
} 