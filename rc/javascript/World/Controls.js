export default class Controls
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.sizes = _options.sizes

        // Set up
        this.target = new THREE.Vector3()
        this.modes = {}
        this.modes.default = 'default'
        this.modes.current = this.modes.default

        this.setActions()
        this.setKeyboard()
    }

    setActions()
    {
        this.actions = {}
        this.actions.up = false
        this.actions.right = false
        this.actions.down = false
        this.actions.left = false
        this.actions.brake = false
        this.actions.boost = false
    }

    setKeyboard()
    {
        this.keyboard = {}
        
        document.addEventListener('keydown', (_event) =>
        {
            switch(_event.code)
            {
                case 'ArrowUp':
                case 'KeyW':
                    this.actions.up = true
                    break

                case 'ArrowRight':
                case 'KeyD':
                    this.actions.right = true
                    break

                case 'ArrowDown':
                case 'KeyS':
                    this.actions.down = true
                    break

                case 'ArrowLeft':
                case 'KeyA':
                    this.actions.left = true
                    break

                case 'Space':
                    this.actions.brake = true
                    break

                case 'ShiftLeft':
                    this.actions.boost = true
                    break
            }
        })

        document.addEventListener('keyup', (_event) =>
        {
            switch(_event.code)
            {
                case 'ArrowUp':
                case 'KeyW':
                    this.actions.up = false
                    break

                case 'ArrowRight':
                case 'KeyD':
                    this.actions.right = false
                    break

                case 'ArrowDown':
                case 'KeyS':
                    this.actions.down = false
                    break

                case 'ArrowLeft':
                case 'KeyA':
                    this.actions.left = false
                    break

                case 'Space':
                    this.actions.brake = false
                    break

                case 'ShiftLeft':
                    this.actions.boost = false
                    break
            }
        })
    }
} 