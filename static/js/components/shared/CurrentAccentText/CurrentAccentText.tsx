import React from 'react';
import { CURRENT_ACCENT } from '../../../graphics/helpers/LandingTheme';

interface CurrentAccentTextProps {
    text: string
}

function CurrentAccentText({ text }: CurrentAccentTextProps) {
    return (
        <span style={{ color: `${CURRENT_ACCENT()}` }}>
            <b>
                {text}
            </b>
        </span>
    );
}

export default CurrentAccentText;
