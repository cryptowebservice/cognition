export interface FaqEntry {
    title: string,
    content: string | (string | string[])[],
    list?: string[]
}

export interface FaqBlock {
    title: string,
    entries: FaqEntry[]
}

export const blocks: FaqBlock[] = [
    {
        title: 'General',
        entries: [
            {
                title: 'What is Neura?',
                content: [
                    'Neura is a decentralized autonomous artist that combines human art and the art of Neural Networks.',
                    'Every holder will act as a node in a global net of the art of the New Era.',
                    'Despite its artistic and subjective value, on the other side, Neura is a complete product with its utility value, providing holders with experience, immersion, and a rewarding system.',
                ],
            },
            {
                title: 'How does the SupremePunks collection relate to Neura?',
                content: [
                    'A long time ago, we began our journey with the art-based project SupremePunks. As a way of thanking all the holders who supported us, we took a ~snapshot~ to reward all owners with a free airdrop based on the quantity of SupremePunks they owned.',
                    'We strongly believe that the aim of every NFT project should be not only to meet stated goals but also to exceed expectations.',
                ],
            },
            {
                title: 'how to start using nEUra?',
                content: [[
                    '1. Log in to your account at ~app.neura.adanede.com~ using ~WalletConnect~ or ~Metamask~',
                    '2. Purchase at least ~1~ Box',
                    '3. Reveal to receive 1 out of 5 Android types',
                    '4. Claim ~1~ Module or Purchase more',
                    '5. Upgrade your Android with Modules',
                    '6. Order paintings',
                ],
                'If you are looking only for a collector’s experience of Neura, then you can purchase paintings on a marketplace, and all of them will also appear in your personal account.'],
            },
            {
                title: 'when is minting',
                content: 'Final minting date is TBA',
            },
            {
                title: 'what blockchain is used',
                content: 'Neura is working on Ethereum',
            },
            {
                title: 'when will all androids and modules be released?',
                content: 'All Androids and Modules will be released gradually, with each release announced on our socials and you will be able to find them on the website.',
            },
            // {
            //     title: 'What neural network model is used to draw pictures?',
            //     content: 'Stable Diffusion is a component in the pipeline responsible for the creation of pictures. Stable Diffusion is an AI modeling technique which uses Text-to-Image method using prompts (painting titles) that describe the scene to create unique images. During the lifetime of a project this Neural Network will work fully automatically based on all data we’ve collected and experiments we’ve conducted.     ',
            // },
            // {
            //     title: 'How much are the royalties?',
            //     content: ['For the Androids and Modules royalty fees are 4%',
            //         'For all paintings royalties are 0%',
            //     ],
            // },
        ],
    },
    {
        title: 'Androids',
        entries: [
            {
                title: 'What is the total supply of androids?',
                content: [
                    'Total supply is TBA. There will be a total of 5 types of Androids manufactured by 5 companies. When you get the Box - you can then reveal it and choose any type you want:',
                    [
                        '1. Sarah by DAA',
                        '2. Nicole by MISU',
                        '3. Anna by ELSI',
                        '4. Roman by FARAON',
                        '5. Kira by KERMESSE',
                    ],
                ],
            },
            {
                title: 'Why each type of Android is not limited?',
                content: [
                    'We want to give holders the opportunity to influence the world of Neura and define its future. You will decide how many Androids of each type will be in Neura based on your preferences. This will determine the final visuals of paintings as well.',
                    'We aim to implement decision-making and gamification mechanics into every element of the project to provide you with immersion. This is one of our core principles that applies to all significant parts of Neura.',
                ],
            },
            {
                title: 'Can androids paint without modules?',
                content: [
                    'Androids CANNOT draw without Modules.',
                    'BUT: in Modules presale you can get ~1 free~ Module for every Android',
                ],
            },
            {
                title: 'How often do androids draw paintings?',
                content: [
                    'The first Painting will be created in 7 days after creation starts. Then, each claimed Painting multiplies the duration by 1.15, except for one type of Android -  Roman - its multiplier is 1.08.',
                ],
            },
            {
                title: 'How do androids from various companies differ?',
                content: 'Each type has a unique perk that affects the workflow of the Android. Paintings differ in basic color palettes and their initial patterns. Based on the base color palette, there is a small probability that an Android will use a different canvas color, which will significantly stand out from the main collection.',
            },
            {
                title: 'What if i do not reveal my Android?',
                content: [
                    'You will be able to reveal your Android at any time you wish. Functions like upgrading and ordering paintings will be available only after the reveal.',
                    'BUT: you CANNOT claim free Modules or buy any in the presale with unrevealed Android.',
                ],
            },
            {
                title: 'Will Androids be used in the future?',
                content: 'Yes, we have very ambitious expansion plans for our company. Androids will be a key for entering the Adanede ecosystem.',
            },
            // {
            //     title: 'How can I participate in the Presale of Androids?',
            //     content: [
            //         'Presale will proceed at app.neura.adanede.com Exact dates will be announced on our socials.',
            //         'Presale allocation: 2 000 Boxes of unrevealed Androids.',
            //         'To participate, you need to submit an application with the number of Boxes you want to reserve.',
            //         'After your application is approved, you\'ll have a two-week window to reserve your boxes.',
            //         'Once all sales stages are completed, the reserved boxes will be airdropped to the wallet from which the payment was made, with no additional holds',
            //     ],
            // },
            {
                title: 'Will Androids be used in future?',
                content: 'Yes, we have very ambitious expansion plans for our company. Androids will be a key for entering in Adanede ecosystem.',
            },
        ],
    },
    {
        title: 'Modules',
        entries: [
            {
                title: 'What is the total supply of modules?',
                content: [
                    'The total number of Modules is TBA. The exact distribution among each of the 6 categories is TBA.',
                ],
            },
            {
                title: 'How does the upgrading system work?',
                content: [
                    'Applying a certain Module to an Android upgrades a certain skill and changes the appearance of your Android. You can purchase and apply multiple Modules of the same type to the Android, boosting a certain skill even more. In this manner, you can achieve any combination of Modules on your Android with up to 3 levels for each Module (except for Nicole, which has 4 levels). Each Module affects paintings differently. Some modify the style, while others directly impact the rarity of the painting.',
                    'BUT: nothing is 100% certain, neural networks only tend to some patterns and rules but they are still unpredictable and can’t be fully controlled.',
                ],
            },
            {
                title: 'is it possible to reset an android’s modules?',
                content: [
                    'No, a reset is not possible. Once a Module is applied to an Android, the Module\'s token is burned, permanently changing the Android\'s metadata. The Android will never be downgraded and will not become a worse artist.',
                ],
            },
            {
                title: 'What if an android is upgraded to maximum?',
                content: 'If your Android is maxed out, you will be able to claim the special and unique rewards in the next Neura stages and get priorities in Adanede ecosystem.',
            },
        ],
    },
    {
        title: 'Paintings',
        entries: [
            {
                title: 'how are paintings created?',
                content: [
                    'All paintings are created by our AI automated system. The drawing process begins as soon as a user orders a painting from an Android. There are several separate neural networks used in the combination. Upon receiving a request from a specific Android, Neura adjusts the system parameters accordingly and selects an input – an initial pattern hand-drawn by an artist. Afterward, the ~Automatic generation of prompts~ creates a unique title (prompt) for the painting based on a large amount of data we’ve been collecting for over a year.'
                     + 'The title and the input are processed by ~Control Net~ and ~Stable Diffusion~ neural networks. The artwork is then upscaled to a higher resolution. The entire painting process is fully automated and doesn\'t require manual intervention at any stage.',
                ],
            },
            {
                title: 'will the same androids with the same modules make the same painting?',
                content: 'No, even though it might seem like it could happen, there is no possibility of that occurring. Firstly, Androids never produce paintings with the same plot. Secondly, even the same module can affect a painting in different ways. Finally, each Android model from the same company has its unique gene that varies its paintings.',
            },
            {
                title: 'what is initial image',
                content: [
                    'Paintings merge two contrasting worlds: human art and AI. Each painting starts with an initial image - an artwork that represents a specific pattern. The AI then processes this pattern, creating a unique variation of the initial artwork.',
                    'Each type of Android has a unique initial image (using the Compressors Module, the initial image can be changed). This allows holders to compare how their Android interpreted the pattern.',
                ],
            },
            {
                title: 'How ARE paintings limited?',
                content: 'We have no limit on the total number of paintings. Instead, we use a time-increasing model, where each next painting takes longer to be drawn. Thus, at some point, the duration required to create a painting will not influence its total quantity.',
            },
            {
                title: 'how Will i be able to use paintings afterwards',
                content: [
                    'First, we will spread Neura art extensively, partnering with digital platforms where holders can showcase their artworks.',
                    'Furthermore, paintings are considered as currency within Neura. There will be special rewards available in exchange for paintings, depending on the stage. Stages are categorized into three groups based on the Android\'s upgrade level at the time of the painting\'s creation:',
                    [
                        'Alpha: 0 - 3 modules',
                        'Beta: 4 - 7 modules',
                        'Gamma: 8 modules and more',
                    ],
                    'There is no difference for the stage type if 4 diffferent or the same Modules were used.',
                ],
            },
        ],
    },
];
