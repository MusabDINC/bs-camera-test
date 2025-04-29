import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.sizes = _options.sizes
        this.renderer = _options.renderer
        this.debug = _options.debug
        this.config = _options.config

        // Set up
        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false

        this.target = new THREE.Vector3(0, 0, 0)
        this.targetEased = new THREE.Vector3(0, 0, 0)
        this.easing = 0.15

        // Kamera modları
        this.modes = {
            current: 'kaput',
            kaput: {
                position: new THREE.Vector3(0.2, 0, 1.0),  // Daha geride ve yüksekte
                lookAt: new THREE.Vector3(8, 0, -0.5)  // Kaputu görecek şekilde aşağı bakış
            },
            takip: {
                position: new THREE.Vector3(2.5, 0, 1.5),  // Arkadan takip
                lookAt: new THREE.Vector3(0, 0, 0)
            },
            kokpit: {
                position: new THREE.Vector3(-0.1, 0, 0.5),  // Kokpit içi
                lookAt: new THREE.Vector3(1, 0, 0.2)
            }
        }

        // Mod değiştirme için
        this.availableModes = ['kaput', 'takip', 'kokpit']
        this.currentModeIndex = 0

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('camera')
        }

        this.setInstance()
        this.setOrbitControls()
        this.setCameraControls()
    }

    setInstance()
    {
        // Kamera kurulumu
        this.instance = new THREE.PerspectiveCamera(60, this.sizes.viewport.width / this.sizes.viewport.height, 0.1, 100)
        this.instance.up.set(0, 0, 1)
        
        // Başlangıç pozisyonu
        const mode = this.modes[this.modes.current]
        this.instance.position.copy(mode.position)
        this.instance.lookAt(mode.lookAt)
        
        this.container.add(this.instance)

        // Pencere boyutu değiştiğinde
        this.sizes.on('resize', () =>
        {
            this.instance.aspect = this.sizes.viewport.width / this.sizes.viewport.height
            this.instance.updateProjectionMatrix()
        })

        // Her frame'de
        this.time.on('tick', () =>
        {
            if(this.car && this.car.chassis)
            {
                const mode = this.modes[this.modes.current]
                const worldPosition = new THREE.Vector3()
                const worldQuaternion = new THREE.Quaternion()
                
                // Araç pozisyonunu al
                this.car.chassis.object.getWorldPosition(worldPosition)
                this.car.chassis.object.getWorldQuaternion(worldQuaternion)
                
                // Kamera pozisyonunu hesapla
                const cameraPosition = mode.position.clone()
                cameraPosition.applyQuaternion(worldQuaternion)
                cameraPosition.add(worldPosition)
                
                // Bakış noktasını hesapla
                const lookAtPosition = mode.lookAt.clone()
                lookAtPosition.applyQuaternion(worldQuaternion)
                lookAtPosition.add(worldPosition)
                
                // Kamerayı güncelle
                this.instance.position.lerp(cameraPosition, this.easing)
                this.instance.lookAt(lookAtPosition)
            }
        })
    }

    setOrbitControls()
    {
        this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement)
        this.orbitControls.enabled = false
        this.orbitControls.enableKeys = false
        this.orbitControls.zoomSpeed = 0.5

        if(this.debug)
        {
            this.debugFolder.add(this.orbitControls, 'enabled').name('orbitControlsEnabled')
        }
    }

    setCameraControls()
    {
        // Kamera modu değiştirme
        window.addEventListener('keydown', (_event) =>
        {
            if(_event.code === 'KeyV')
            {
                this.currentModeIndex = (this.currentModeIndex + 1) % this.availableModes.length
                this.modes.current = this.availableModes[this.currentModeIndex]
                
                // Bildirim göster
                this.showCameraChangeNotification()
            }
        })
    }

    showCameraChangeNotification()
    {
        // Mevcut bildirimi temizle
        const existingNotification = document.querySelector('.camera-notification')
        if(existingNotification) {
            document.body.removeChild(existingNotification)
        }
        
        // Yeni bildirimi oluştur
        const notification = document.createElement('div')
        notification.className = 'camera-notification'
        notification.textContent = `Kamera: ${this.modes.current.toUpperCase()}`
        
        // Stil ekle
        notification.style.position = 'absolute'
        notification.style.top = '20px'
        notification.style.left = '50%'
        notification.style.transform = 'translateX(-50%)'
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
        notification.style.color = 'white'
        notification.style.padding = '10px 20px'
        notification.style.borderRadius = '5px'
        notification.style.fontFamily = 'Arial, sans-serif'
        notification.style.zIndex = '1000'
        
        // Ekrana ekle
        document.body.appendChild(notification)
        
        // 2 saniye sonra kaldır
        setTimeout(() => {
            notification.style.opacity = '0'
            notification.style.transition = 'opacity 0.5s'
            setTimeout(() => {
                if(notification.parentNode) {
                    document.body.removeChild(notification)
                }
            }, 500)
        }, 2000)
    }

    setCar(car)
    {
        this.car = car
        console.log('Kamera araca bağlandı:', car)
    }
}
