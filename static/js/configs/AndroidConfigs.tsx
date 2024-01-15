import { ReactNode } from 'react';
import { Vector2, Vector3 } from 'three';

import AnnaImage from '../assets/images/android_list/anna.png';
import KiraImage from '../assets/images/android_list/kira.png';
import NicoleImage from '../assets/images/android_list/nicole.png';
import NikitaImage from '../assets/images/android_list/nikita.png';
import SarahImage from '../assets/images/android_list/sarah.png';
import { AndroidSurfaceGroup, EditorPreset } from '../graphics/presets/editor/EditorPreset';
import { NicolePreset } from '../graphics/presets/editor/NicolePreset';
import { NikitaPreset } from '../graphics/presets/editor/NikitaPreset';
import nicoleEditorConfig from './NicoleEditorConfig';
import sarahEditorConfig from './SarahEditorConfig';

import kiraEditorConfig from './KiraEditorConfig';
import nikitaEditorConfig from './NikitaEditorConfig';
import nicoleFullSet from '../fullsets/NicoleFullSet';
import nikitaFullSet from '../fullsets/NikitaFullSet';
import sarahFullSet from '../fullsets/SarahFullSet';
import kiraFullSet from '../fullsets/KiraFullSet';
import annaEditorConfig from './AnnaEditorConfig';
import annaFullSet from '../fullsets/AnnaFullSet';

export interface AndroidConfig {

    // Базовая инфа
    id: number,
    hidden?: boolean,
    name: string,
    description: string,
    manufacturer: string,
    lockedUntil?: Date,

    // Визуальная часть
    previewImage: string,
    icon: ReactNode,
    preset: (typeof EditorPreset) | null,
    fullSetGroup: AndroidEditorGroupLevel[],

    // Параметры редактора
    groups: AndroidEditorGroup[],

}

/**
 * Параметры подуровней модулей
 */
export interface AndroidEditorGroup {
    name: string,
    description: string,
    group: AndroidSurfaceGroup,
    levels: AndroidEditorGroupLevel[],
    lockedUntil?: Date,
    disabled?: boolean;

    camera?: Vector3,
    cameraZoom?: number,

    cameraVideo?: Vector2,
    cameraZoomVideo?: number,
}

/**
 * Один из подуровней модуля
 */
export interface AndroidEditorGroupLevel {
    image: string,
    description: string,
    lockedUntil?: Date,
}

const configs: AndroidConfig[] = [

    // Nicole
    {
        id: 0,
        name: 'Nicole',
        description: 'Overall description for Nicole android',
        manufacturer: 'Misu LTD',

        previewImage: NicoleImage,
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="#202024">
            <path d="m27.2776 5.4785-2.3128-1.0078-16.242 27.2242 2.3127 1.0078L27.2776 5.4785Z" />
            <path d="m8.7224 5.4785 2.3128-1.0078 8.2188 13.7761-2.3127 1.0078-8.2189-13.776Z" />
            <path
                d="m20.8469 12.6196.9455-.4661-3.7873-7.1828-.4296.8147-.0085-.0042-3.36 6.3723.9455.4661 2.8473-5.3998 2.8471 5.3998ZM14.2271.0648 14.2612 0l-.0542.0267.0201.038ZM9.625 5.043H7.0781v27.0819h2.547V5.0429ZM28.9219 5.043H26.375v27.0819h2.5469V5.0429Z"
            />
            <path
                d="M16.9489 1.211C7.4969 1.7372 0 9.316 0 18.5881c0 9.6134 8.0589 17.4065 18 17.4065s18-7.7931 18-17.4065c0-9.272-7.4969-16.851-16.9489-17.3773v2.7836c7.8643.522 14.0762 6.8563 14.0762 14.5937 0 8.0792-6.7727 14.6286-15.1273 14.6286S2.8727 26.6674 2.8727 18.5882c0-7.7374 6.212-14.0718 14.0762-14.5937V1.2109Z"
            />
        </svg>,
        preset: NicolePreset,
        fullSetGroup: nicoleFullSet,
        groups: nicoleEditorConfig,
    },

    // Roman
    {
        id: 2,
        name: 'Roman',
        description: '',
        manufacturer: 'Faraon TM',

        previewImage: NikitaImage,
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
            <path
                d="M17.9279 14.6037a.3581.3581 0 0 1-.025.1298.6044.6044 0 0 1-.0418.1054 9.386 9.386 0 0 1-.1754.4137 5.3497 5.3497 0 0 0-.167.4137c-.2005.611-.3564 1.2951-.4678 2.0521-.1058.7517-.1726 1.5384-.2004 2.3605.128.0107.2533.0216.3758.0323.1225.0054.2478.0081.3759.0081.2561 0 .5317-.0109.8269-.0324.2951-.0216.5846-.0487.8686-.0811a12.711 12.711 0 0 0 .7935-.1298c.2506-.0486.4593-.1.6265-.154l.1001.0972c-.5011.3029-1.0913.5353-1.7707.6977-.6793.1622-1.4171.273-2.2133.3324-.0112.8923.0139 1.771.0751 2.6361.0613.8707.1504 1.6872.2673 2.4496l-.142.065c-.1615-.3569-.3007-.7408-.4176-1.1518a17.0898 17.0898 0 0 1-.309-1.2735 20.3568 20.3568 0 0 1-.2089-1.3383 39.0057 39.0057 0 0 1-.1252-1.3465 6.9493 6.9493 0 0 1-.3425.0082h-.3424a8.6514 8.6514 0 0 1-.3508-.0082 2.0118 2.0118 0 0 1-.3675-.0649c-.117-.0378-.2144-.0946-.2924-.1702-.0779-.0811-.1169-.192-.1169-.3326 0-.092.0223-.1677.0668-.2272a.583.583 0 0 1 .1754-.154.716.716 0 0 1 .2339-.0893 1.0978 1.0978 0 0 1 .2589-.0325.9146.9146 0 0 1 .1253.0082c.0445.0053.0891.0134.1336.0243.1281.0162.2562.0352.3842.0568.1281.0161.2562.0325.3842.0486a11.2794 11.2794 0 0 1-.0167-.6083v-.5921c0-.1839.0028-.3975.0084-.6408a13.568 13.568 0 0 1 .0418-.7868c.0278-.2758.064-.5516.1085-.8274a5.5626 5.5626 0 0 1 .2005-.7949c.0835-.2487.1893-.4704.3174-.6651.128-.1947.284-.3461.4677-.4542a3.79 3.79 0 0 1 .3007-.1379c.1114-.0487.2172-.073.3174-.073.1726 0 .2589.0757.2589.2271ZM24 12.2109c-.4064.3028-.8796.5651-1.4198.7868-.5401.2163-1.1053.3974-1.6955.5434a14.5225 14.5225 0 0 1-1.7708.3245c-.5902.0703-1.1387.1054-1.6454.1054-.1559 0-.3536-.0081-.593-.0243a16.2372 16.2372 0 0 1-.7768-.073 12.9074 12.9074 0 0 1-.8435-.1298 10.7967 10.7967 0 0 1-.8269-.2028c-.2562-.0811-.4845-.1757-.6849-.2839-.2005-.1081-.3508-.2298-.4511-.365a6.5249 6.5249 0 0 1-.1921-.3082c-.0668-.1189-.1002-.2379-.1002-.3569 0-.1514.0863-.2271.2589-.2271a.7427.7427 0 0 1 .117.0081c.0334.0054.0724.0135.1169.0243.2116.0649.412.1325.6014.2028.1949.0703.3953.1352.6013.1947.6738.1514 1.3503.265 2.0297.3407a20.2726 20.2726 0 0 0 2.0714.1054c.8464 0 1.715-.0622 2.6058-.1865.8911-.1244 1.7346-.3326 2.5309-.6246l.0667.146Z"
                fill="#202024"
            />
            <path
                d="M19.3184 1.0504A17.239 17.239 0 0 0 18 1C8.6112 1 1 8.6112 1 18c0 9.3889 7.6112 17 17 17 9.3889 0 17-7.6111 17-17 0-3.9107-1.3205-7.513-3.54-10.3853"
                stroke="#202024"
                strokeLinecap="round"
            />
        </svg>,
        preset: NikitaPreset,
        fullSetGroup: nikitaFullSet,
        groups: nikitaEditorConfig,
    },

    // Anna
    {
        id: 1,
        name: 'Anna',
        description: '',
        manufacturer: 'Elsi Inc.',

        previewImage: AnnaImage,
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
            <g clipPath="url(#clip-icon-anna)">
                <path d="M35.6538.1406H.1406v35.5132h35.5132V.1406Z" stroke="#202024" />
                <path
                    d="M14.7445 13.0573v.72H9.1758v-7.875h5.4v.72h-4.5675v2.8013h4.0725v.7087h-4.0725v2.925h4.7362ZM22.1992 5.9023h.8325v7.155h4.41v.72h-5.2425v-7.875ZM12.5988 29.3655c-.585 0-1.1475-.0939-1.6875-.2812-.5325-.1876-.945-.4351-1.2375-.7425l.3263-.6413c.285.285.6637.5175 1.1362.6975.4725.1724.96.2588 1.4625.2588.705 0 1.2338-.1277 1.5863-.3825.3525-.2626.5287-.6001.5287-1.0126 0-.315-.0975-.5662-.2925-.7537-.1875-.1875-.42-.33-.6975-.4275-.2775-.105-.6637-.2175-1.1587-.3375-.5925-.15-1.065-.2925-1.4175-.4275a2.4298 2.4298 0 0 1-.9113-.6413c-.2475-.285-.3712-.6712-.3712-1.1587 0-.3975.105-.7575.315-1.08.21-.33.5325-.5925.9675-.7875.435-.195.975-.2925 1.62-.2925.45 0 .8887.0637 1.3162.1912.435.12.81.2888 1.125.5063l-.2812.6637a3.7472 3.7472 0 0 0-1.0575-.4837c-.375-.1125-.7425-.1688-1.1025-.1688-.69 0-1.2113.135-1.5638.405-.345.2625-.5175.6038-.5175 1.0238 0 .315.0938.57.2813.765.195.1875.435.3337.72.4387.2925.0975.6825.2063 1.17.3263.5775.1425 1.0425.285 1.395.4275.36.135.6637.345.9112.63.2475.2775.3713.6562.3713 1.1362 0 .3975-.1088.7613-.3263 1.0913-.21.3223-.5362.5811-.9787.7763-.4425.1873-.9863.2812-1.6313.2812ZM23.8145 21.4238h.8325v7.8751h-.8325v-7.8751Z"
                    fill="#202024"
                />
            </g>
            <defs>
                <clipPath id="clip-icon-anna">
                    <path fill="#fff" d="M0 0h36v36H0z" />
                </clipPath>
            </defs>
        </svg>,
        preset: NicolePreset,
        fullSetGroup: annaFullSet,
        groups: annaEditorConfig,

    },

    // Sarah
    {
        id: 4,
        name: 'Sarah',
        description: '',
        manufacturer: 'DAA Corp.',

        previewImage: SarahImage,
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
            <g opacity=".86" fill="#202024">
                <path
                    opacity=".4"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 21.1607c1.5162 8.3883 8.7832 14.7464 17.5194 14.7464 9.8364 0 17.8102-8.0602 17.8102-18.003C35.3296 8.6027 28.3512.9488 19.3983 0v5.9197c5.4443 1.0824 9.5586 6.0526 9.5586 12.0203 0 6.7594-5.2782 12.2389-11.7892 12.2389-5.4373 0-10.0148-3.8212-11.3767-9.0182H0Z"
                />
                <path
                    d="M13.7419 4.629H9.0645v29.8233h4.6774V4.6289ZM32.0914 8.629h-16.191v4.3643h16.191V8.6289ZM20.5778 14.8125h-4.6774v12.3657h4.6774V14.8125Z"
                />
            </g>
        </svg>,
        preset: NicolePreset,
        fullSetGroup: sarahFullSet,
        groups: sarahEditorConfig,
    },

    // Kira
    {
        id: 3,
        name: 'Kira',
        description: '',
        manufacturer: 'Kermesse Group',

        previewImage: KiraImage,
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 36">
            <path
                d="M9.7578 9.8398h6.6108v16.6989H9.7578V9.8398Zm8.6505 4.5465c0-1.8104.4587-3.0269 1.3762-3.6494.8683-.5817 2.5026-.8725 4.9028-.8725h1.241v2.3224c0 1.8513-.471 3.1702-1.413 3.9566-.9585.7864-2.6091 1.1796-4.952 1.1796h-1.155v-2.9367Zm0 4.2146h1.155c2.3101 0 3.9607.4588 4.952 1.3762.942.8766 1.413 2.261 1.413 4.1533v2.4329h-1.241c-2.3511 0-3.9853-.3522-4.9028-1.0567-.9175-.7127-1.3762-1.9906-1.3762-3.8338v-3.0719ZM35.0914 0H1.0488v4.993h34.0426V0ZM35.0914 30.8652H1.0488v4.993h34.0426v-4.993Z"
                fill="#202024"
            />
        </svg>,
        preset: NicolePreset,
        fullSetGroup: kiraFullSet,
        groups: kiraEditorConfig,
    },

];

export default configs;
