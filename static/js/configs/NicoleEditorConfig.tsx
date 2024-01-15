import { Vector2, Vector3 } from 'three';

import Head1Icon from '../assets/images/editor/nicole/3d/3d-1.png';
import Head2Icon from '../assets/images/editor/nicole/3d/3d-2.png';
import Head3Icon from '../assets/images/editor/nicole/3d/3d-3.png';
import Head4Icon from '../assets/images/editor/nicole/3d/3d-4.png';
import Head5Icon from '../assets/images/editor/nicole/3d/3d-5.png';
import Hands1Icon from '../assets/images/editor/nicole/compressor/сompressors-1.png';
import Hands2Icon from '../assets/images/editor/nicole/compressor/сompressors-2.png';
import Hands3Icon from '../assets/images/editor/nicole/compressor/сompressors-3.png';
import Hands4Icon from '../assets/images/editor/nicole/compressor/сompressors-4.png';
import Hands5Icon from '../assets/images/editor/nicole/compressor/сompressors-5.png';
import Shoulders1Icon from '../assets/images/editor/nicole/layers/layers-1.png';
import Shoulders2Icon from '../assets/images/editor/nicole/layers/layers-2.png';
import Shoulders3Icon from '../assets/images/editor/nicole/layers/layers-3.png';
import Shoulders4Icon from '../assets/images/editor/nicole/layers/layers-4.png';
import Shoulders5Icon from '../assets/images/editor/nicole/layers/layers-5.png';
import Helmet1Icon from '../assets/images/editor/nicole/memory/memory-1.png';
import Helmet2Icon from '../assets/images/editor/nicole/memory/memory-2.png';
import Helmet3Icon from '../assets/images/editor/nicole/memory/memory-3.png';
import Helmet4Icon from '../assets/images/editor/nicole/memory/memory-4.png';
import Helmet5Icon from '../assets/images/editor/nicole/memory/memory-5.png';
import Neck1Icon from '../assets/images/editor/nicole/processor/processor-1.png';
import Neck2Icon from '../assets/images/editor/nicole/processor/processor-2.png';
import Neck3Icon from '../assets/images/editor/nicole/processor/processor-3.png';
import Neck4Icon from '../assets/images/editor/nicole/processor/processor-4.png';
import Neck5Icon from '../assets/images/editor/nicole/processor/processor-5.png';
import Chest1Icon from '../assets/images/editor/nicole/visual/visual-1.png';
import Chest2Icon from '../assets/images/editor/nicole/visual/visual-2.png';
import Chest3Icon from '../assets/images/editor/nicole/visual/visual-3.png';
import Chest4Icon from '../assets/images/editor/nicole/visual/visual-4.png';
import Chest5Icon from '../assets/images/editor/nicole/visual/visual-5.png';
import { AndroidSurfaceGroup } from '../graphics/presets/editor/EditorPreset';
import { AndroidEditorGroup } from './AndroidConfigs';

const config: AndroidEditorGroup[] = [
    {
        name: 'Extended Memory',
        description: 'Broadens artistic styles, nurtures creative growth',
        group: AndroidSurfaceGroup.Head,

        camera: new Vector3(0, 1.76, 1),
        cameraZoom: 1.7,

        cameraVideo: new Vector2(0, 0.3),
        cameraZoomVideo: 1.5,

        levels: [
            {
                image: Head1Icon,
                description: 'Level 0. Test description',
            },
            {
                image: Head2Icon,
                description: 'Level 1. Test description',
            },
            {
                image: Head3Icon,
                description: 'Level 2. Test description',
            },
            {
                image: Head4Icon,
                description: 'Level 3. Test description',
            },
            {
                image: Head5Icon,
                description: 'Level 4. Test description',
            },
        ],
    },
    {
        name: 'Compressors',
        description: 'Simplifies inputs, neural network creates unique rarity',
        group: AndroidSurfaceGroup.Neck,
        camera: new Vector3(0, 1.79, 1),
        cameraZoom: 1.8,

        cameraVideo: new Vector2(0, 0.2),
        cameraZoomVideo: 1.5,

        levels: [
            {
                image: Neck1Icon,
                description: 'Level 0. Test description',
            },
            {
                image: Neck2Icon,
                description: 'Level 1. Test description',
            },
            {
                image: Neck3Icon,
                description: 'Level 2. Test description',
            },
            {
                image: Neck4Icon,
                description: 'Level 3. Test description',
            },
            {
                image: Neck5Icon,
                description: 'Level 3. Test description',
            },
        ],
    },
    {
        name: 'Additional Layers',
        description: 'Expands color palettes, enhances artwork diversity',
        group: AndroidSurfaceGroup.Vision,
        camera: new Vector3(0, 1.65, 1),
        cameraZoom: 1.9,

        cameraVideo: new Vector2(0, 0.05),
        cameraZoomVideo: 1.2,

        levels: [
            {
                image: Chest1Icon,
                description: 'Level 0. Test description',
            },
            {
                image: Chest2Icon,
                description: 'Level 1. Test description',
            },
            {
                image: Chest3Icon,
                description: 'Level 2. Test description',
            },
            {
                image: Chest4Icon,
                description: 'Level 3. Test description',
            },
            {
                image: Chest5Icon,
                description: 'Level 4. Test description',
            },
        ],
    },
    {
        name: 'Post Processor',
        description: 'Reduces the time needed to create paintings',

        group: AndroidSurfaceGroup.Body,
        camera: new Vector3(0, 1.68, 1),
        cameraZoom: 1.7,

        cameraVideo: new Vector2(-0.1, 0.45),
        cameraZoomVideo: 1.8,

        levels: [
            {
                image: Helmet1Icon,
                description: 'Level 0. Test description',
            },
            {
                image: Helmet2Icon,
                description: 'Level 1. Test description',
            },
            {
                image: Helmet3Icon,
                description: 'Level 2. Test description',
            },
            {
                image: Helmet4Icon,
                description: 'Level 3. Test description',
            },
            {
                image: Helmet5Icon,
                description: 'Level 3. Test description',
            },
        ],

    },
    {
        name: 'ADND',
        description: 'Internal help text for visual boost',
        disabled: true,

        group: AndroidSurfaceGroup.Shoulders,
        camera: new Vector3(0, 1.6, 1),
        cameraZoom: 1.7,

        cameraVideo: new Vector2(-0.1, 0.25),
        cameraZoomVideo: 1.6,

        levels: [
            {
                image: Shoulders1Icon,
                description: 'Level 0. Test description',
            },
            {
                image: Shoulders2Icon,
                description: 'Level 1. Test description',
            },
            {
                image: Shoulders3Icon,
                description: 'Level 2. Test description',
            },
            {
                image: Shoulders4Icon,
                description: 'Level 3. Test description',
            },
            {
                image: Shoulders5Icon,
                description: 'Level 4. Test description',
            },
        ],
    },
    {
        name: 'Visual Boost',
        description: 'Internal help text for visual boost',
        disabled: true,

        group: AndroidSurfaceGroup.Hands,
        camera: new Vector3(0.38, 1.3, 1),
        cameraZoom: 2.2,

        cameraVideo: new Vector2(0.35, -0.32),
        cameraZoomVideo: 1.6,

        levels: [
            {
                image: Hands1Icon,
                description: 'Level 0. Test description',
            },
            {
                image: Hands2Icon,
                description: 'Level 1. Test description',
            },
            {
                image: Hands3Icon,
                description: 'Level 2. Test description',
            },
            {
                image: Hands4Icon,
                description: 'Level 3. Test description',
            },
            {
                image: Hands5Icon,
                description: 'Level 4. Test description',
            },
        ],
    },
];
export default config;
