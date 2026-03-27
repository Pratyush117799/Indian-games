import { Composition, registerRoot } from 'remotion';
import { CardReveal } from './CardReveal';
import weapons from '../data/weapons.json';
import { Weapon } from '../types';
import '../index.css'; // Import Tailwind styles for video

export const RemotionVideo: React.FC = () => {
    const demoWeapon = weapons[0] as Weapon;

    return (
        <>
            <Composition
                id="CardReveal-Brahmastra"
                component={CardReveal}
                durationInFrames={150}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    weapon: demoWeapon
                }}
            />
            <Composition
                id="CardReveal-Pashupatastra"
                component={CardReveal}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1920} // Mobile Ratio
                defaultProps={{
                    weapon: weapons[2] as Weapon
                }}
            />
        </>
    );
};

registerRoot(RemotionVideo);
