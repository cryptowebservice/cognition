import clsx from 'clsx';

interface LogoProps {
    active: boolean
}

const paths = [
    'M0 30H3V18H6V15H3V3H8V30H11V0H0V30Z',
    'M25 27H20V21H17V30H20H25H28V0H25V15H20V18H25V27Z',
    'M34 30H37V18H40V15H37V3H42V30H45V0H34V30Z',
    'M51 30H54V3H59V30H62V0H51V30Z',
    'M68 0H79V3H71V15H74V18H71V27H79V30H68V0Z',
    'M93 27H88V21H85V30H88H93H96V0H93V15H88V18H93V27Z',
    'M102 0H113V3H105V15H108V18H105V27H113V30H102V0Z',
];

const offsets = [
    0,
    -15,
    -30,
    -45,
    -60,
    -75,
    -90,
];

export function AdanedeLogo({ active }: LogoProps) {
    return (
        <svg className={clsx('logo', active && 'active')} width="279" height="74" viewBox="0 0 113 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            {
                paths.map((path, key) => (
                    <path
                        d={path}
                        key={key}
                        style={{
                            transform: `translateX(${!active ? offsets[key] : 0}%)`,

                            // opacity: `${!active && key !== offsets.length - 1 ? 0 : 1}`,
                        }}
                        fill='white'
                    />
                ))
            }
        </svg>
    );
}
