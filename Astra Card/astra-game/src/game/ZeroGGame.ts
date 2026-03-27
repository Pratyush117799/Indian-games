import Phaser from './phaser-shim';

export const ZERO_G_CONFIG: any = {
    type: Phaser.AUTO,
    width: 800, // Will be responsive in wrapper
    height: 600,
    parent: 'phaser-container',
    backgroundColor: '#0f172a', // Slate-900
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0, x: 0 }, // Zero Gravity
            debug: true, // Show hitboxes for now
            runner: {
                isFixed: true,
                fps: 60
            }
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
