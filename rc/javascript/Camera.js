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
            current: 'orjinal',
            orjinal: {
                position: new THREE.Vector3(0, -4, 2),
                lookAt: new THREE.Vector3(0, 1, 0)
            },
            takip: {
                position: new THREE.Vector3(0, -6, 3),
                lookAt: new THREE.Vector3(0, 0, 0)
            },
            ust: {
                position: new THREE.Vector3(0, 0, 15),
                lookAt: new THREE.Vector3(0, 0, 0)
            }
        }

        // Mod değiştirme için
        this.availableModes = ['orjinal', 'takip', 'ust']
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
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.viewport.width / this.sizes.viewport.height, 0.1, 100)
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
                if(this.modes.current !== 'ust') {
                    cameraPosition.applyQuaternion(worldQuaternion)
                }
                cameraPosition.add(worldPosition)
                
                // Bakış noktasını hesapla
                const lookAtPosition = mode.lookAt.clone()
                if(this.modes.current !== 'ust') {
                    lookAtPosition.applyQuaternion(worldQuaternion)
                }
                lookAtPosition.add(worldPosition)
                
                // Kamerayı yumuşak şekilde güncelle
                this.instance.position.lerp(cameraPosition, this.easing)
                this.instance.lookAt(lookAtPosition)
            }
        })
    }

    setOrbitControls()
    {
        // Set up
        this.orbitControls = new OrbitControls(this.instance, this.renderer.domElement)
        this.orbitControls.enabled = false
        this.orbitControls.enableKeys = false
        this.orbitControls.zoomSpeed = 0.5

        // Debug
        if(this.debug)
        {
            this.debugFolder.add(this.orbitControls, 'enabled').name('orbitControlsEnabled')
        }
    }

    setCameraControls()
    {
        window.addEventListener('keydown', (_event) =>
        {
            if(_event.code === 'KeyC')
            {
                this.currentModeIndex = (this.currentModeIndex + 1) % this.availableModes.length
                this.modes.current = this.availableModes[this.currentModeIndex]
                console.log('Kamera modu:', this.modes.current)
            }
        })
    }

    setCar(car)
    {
        this.car = car
        console.log('Kamera araca bağlandı:', car)
    }
} 