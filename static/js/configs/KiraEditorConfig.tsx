import { Vector2, Vector3 } from 'three';

import Icon3d1 from '../assets/images/editor/kira/3d/3d-1.png';
import Icon3d2 from '../assets/images/editor/kira/3d/3d-2.png';
import Icon3d3 from '../assets/images/editor/kira/3d/3d-3.png';
import Icon3d4 from '../assets/images/editor/kira/3d/3d-4.png';
import IconCompressor1 from '../assets/images/editor/kira/compressor/сompressors-1.png';
import IconCompressor2 from '../assets/images/editor/kira/compressor/сompressors-2.png';
import IconCompressor3 from '../assets/images/editor/kira/compressor/сompressors-3.png';
import IconCompressor4 from '../assets/images/editor/kira/compressor/сompressors-4.png';
import IconLayers1 from '../assets/images/editor/kira/layers/layers-1.png';
import IconLayers2 from '../assets/images/editor/kira/layers/layers-2.png';
import IconLayers3 from '../assets/images/editor/kira/layers/layers-3.png';
import IconLayers4 from '../assets/images/editor/kira/layers/layers-4.png';
import IconMemory1 from '../assets/images/editor/kira/memory/memory-1.png';
import IconMemory2 from '../assets/images/editor/kira/memory/memory-2.png';
import IconMemory3 from '../assets/images/editor/kira/memory/memory-3.png';
import IconMemory4 from '../assets/images/editor/kira/memory/memory-4.png';
import IconProcessor1 from '../assets/images/editor/kira/processor/processor-1.png';
import IconProcessor2 from '../assets/images/editor/kira/processor/processor-2.png';
import IconProcessor3 from '../assets/images/editor/kira/processor/processor-3.png';
import IconProcessor4 from '../assets/images/editor/kira/processor/processor-4.png';
import IconVisual1 from '../assets/images/editor/kira/visual/visual-1.png';
import IconVisual2 from '../assets/images/editor/kira/visual/visual-2.png';
import IconVisual3 from '../assets/images/editor/kira/visual/visual-3.png';
import IconVisual4 from '../assets/images/editor/kira/visual/visual-4.png';
import { AndroidSurfaceGroup } from '../graphics/presets/editor/EditorPreset';
import { AndroidEditorGroup } from './AndroidConfigs';

const config: AndroidEditorGroup[] = [
    {
        name: 'Extended Memory',
        description: 'Broadens artistic styles, nurtures creative growth',

        group: AndroidSurfaceGroup.Head,
        camera: new Vector3(0, 1.65, 1),
        cameraZoom: 1.9,

        cameraVideo: new Vector2(0, 0.18),
        cameraZoomVideo: 1.2,

        levels: [
            {
                image: Icon3d1,
                description: 'Level 0. Test description',
            },
            {
                image: Icon3d2,
                description: 'Level 1. Test description',
            },
            {
                image: Icon3d3,
                description: 'Level 2. Test description',
            },
            {
                image: Icon3d4,
                description: 'Level 3. Test description',
            },
        ],
    },
    {
        name: 'Compressors',
        description: 'Simplifies inputs, neural network creates unique rarity',

        group: AndroidSurfaceGroup.Neck,
        camera: new Vector3(0, 1.68, 1),
        cameraZoom: 1.7,

        cameraVideo: new Vector2(-0.1, 0.45),
        cameraZoomVideo: 1.8,

        levels: [
            {
                image: IconMemory1,
                description: 'Level 0. Test description',
            },
            {
                image: IconMemory2,
                description: 'Level 1. Test description',
            },
            {
                image: IconMemory3,
                description: 'Level 2. Test description',
            },
            {
                image: IconMemory4,
                description: 'Level 3. Test description',
            },
        ],
    },
    {
        name: 'Additional Layers',
        description: 'Expands color palettes, enhances artwork diversity',
        group: AndroidSurfaceGroup.Vision,

        camera: new Vector3(0, 1.6, 1),
        cameraZoom: 1.7,

        cameraVideo: new Vector2(-0.1, 0.25),
        cameraZoomVideo: 1.6,

        levels: [
            {
                image: IconProcessor1,
                description: 'Level 0. Test description',
            },
            {
                image: IconProcessor2,
                description: 'Level 1. Test description',
            },
            {
                image: IconProcessor3,
                description: 'Level 2. Test description',
            },
            {
                image: IconProcessor4,
                description: 'Level 3. Test description',
            },
        ],
    },
    {
        name: 'Post Processor',
        description: 'Reduces the time needed to create paintings',
        group: AndroidSurfaceGroup.Body,

        camera: new Vector3(0, 1.76, 1),
        cameraZoom: 1.7,

        cameraVideo: new Vector2(0, -0.2),
        cameraZoomVideo: 1.5,

        levels: [
            {
                image: IconVisual1,
                description: 'Level 0. Test description',
            },
            {
                image: IconVisual2,
                description: 'Level 1. Test description',
            },
            {
                image: IconVisual3,
                description: 'Level 2. Test description',
            },
            {
                image: IconVisual4,
                description: 'Level 3. Test description',
            },
        ],
    },
    {
        name: 'ADND',
        description: 'Internal help text for visual boost',
        disabled: true,

        group: AndroidSurfaceGroup.Shoulders,
        camera: new Vector3(0.38, 1.3, 1),
        cameraZoom: 1.8,

        cameraVideo: new Vector2(0, 0.0),
        cameraZoomVideo: 1.6,

        levels: [
            {
                image: IconLayers1,
                description: 'Level 0. Test description',
            },
            {
                image: IconLayers2,
                description: 'Level 1. Test description',
            },
            {
                image: IconLayers3,
                description: 'Level 2. Test description',
            },
            {
                image: IconLayers4,
                description: 'Level 3. Test description',
            },
        ],
    },
    {
        name: 'Visual Boost',
        description: 'Internal help text for visual boost',
        disabled: true,

        group: AndroidSurfaceGroup.Hands,
        camera: new Vector3(0, 1.79, 1),
        cameraZoom: 1.8,

        cameraVideo: new Vector2(0.2, -0.3),
        cameraZoomVideo: 1.5,

        levels: [
            {
                image: IconCompressor1,
                description: 'Level 0. Test description',
            },
            {
                image: IconCompressor2,
                description: 'Level 1. Test description',
            },
            {
                image: IconCompressor3,
                description: 'Level 2. Test description',
            },
            {
                image: IconCompressor4,
                description: 'Level 3. Test description',
            },
        ],
    },

];
export default config;
