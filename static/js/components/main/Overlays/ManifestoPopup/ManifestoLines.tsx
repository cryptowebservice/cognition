import { CURRENT_ACCENT } from '../../../../graphics/helpers/LandingTheme';

interface LinesProps {
    flipped?: boolean
}

export function ManifestoLines(props: LinesProps) {
    const {
        flipped,
    } = props;

    return (
        <div className="svg-wrap">
            <svg style={{ transform: `rotate(${flipped ? 180 : 0}deg)` }} width="800" height="22">
                <path d="m232.236 7.028-.447-.224.447.224Zm-4.472 8.944.447.224-.447-.224ZM0 21h218.82v1H0v-1Zm227.317-5.252 4.472-8.944.894.447-4.472 8.945-.894-.448ZM241.18 1H374v1H241.18V1Zm-9.391 5.804A10.499 10.499 0 0 1 241.18 1v1a9.5 9.5 0 0 0-8.497 5.251l-.894-.447ZM218.82 21a9.501 9.501 0 0 0 8.497-5.252l.894.448A10.499 10.499 0 0 1 218.82 22v-1Z" fill="url(#a)" />
                <path d="m567.764 7.028.447-.224-.447.224Zm4.472 8.944-.447.224.447-.224ZM800 21H581.18v1H800v-1Zm-227.317-5.252-4.472-8.944-.894.447 4.472 8.945.894-.448ZM558.82 1H426v1h132.82V1Zm9.391 5.804A10.499 10.499 0 0 0 558.82 1v1a9.5 9.5 0 0 1 8.497 5.251l.894-.447ZM581.18 21a9.501 9.501 0 0 1-8.497-5.252l-.894.448A10.499 10.499 0 0 0 581.18 22v-1Z" fill="url(#b)" />
                <rect width="3" height="3" rx="1.5" transform="matrix(-1 0 0 1 397 0)" fill="#fff" />
                <rect width="3" height="3" rx="1.5" transform="matrix(-1 0 0 1 406 0)" fill="#fff" />
                <defs>
                    <linearGradient id="a" x1="363.611" y1="21.5" x2="0" y2="21.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor={CURRENT_ACCENT()} />
                        <stop offset="1" stopColor="#373744" />
                    </linearGradient>
                    <linearGradient id="b" x1="436.389" y1="21.5" x2="800" y2="21.5" gradientUnits="userSpaceOnUse">
                        <stop stopColor={CURRENT_ACCENT()} />
                        <stop offset="1" stopColor="#373744" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

    );
}
